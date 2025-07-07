import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useFormContext } from "@/app/context/form-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormElement } from "@/types/form";
import { nanoid } from "nanoid";
import { ELEMENT_GROUPS, isSpecialElement } from "./ElementConfig";
import { getDefaultProperties } from "./form-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDefaultQuestion } from "./default-questions";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

export function ElementToolbar({ className }: { className?: string }) {
  const { dispatch } = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearchQuery(value);
  }, 300);

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        event.key === "Escape" &&
        searchInputRef.current === document.activeElement
      ) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      } else if (
        event.key === "Enter" &&
        searchInputRef.current === document.activeElement
      ) {
        const singleMatch = getSingleMatch();
        if (singleMatch) {
          createNewElement(singleMatch.type);
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [debouncedSearchQuery]);

  const createNewElement = (type: FormElement["type"]) => {
    const id = nanoid();
    const properties = getDefaultProperties(type);

    const baseElement = {
      id,
      type,
      required: false,
      order: Date.now(),
      // Only add question for non-special elements
      ...(isSpecialElement(type) ? {} : { question: getDefaultQuestion(type) }),
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: { ...baseElement, properties } as FormElement,
    });
  };

  // Filter elements based on search query
  const filteredGroups = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return ELEMENT_GROUPS;
    }

    const query = debouncedSearchQuery.toLowerCase();
    const filtered: typeof ELEMENT_GROUPS = {};

    Object.entries(ELEMENT_GROUPS).forEach(([groupName, elements]) => {
      const matchingElements = elements.filter((element) =>
        element.label.toLowerCase().includes(query),
      );

      if (matchingElements.length > 0) {
        filtered[groupName as keyof typeof ELEMENT_GROUPS] = matchingElements;
      }
    });

    return filtered;
  }, [debouncedSearchQuery]);

  // Get single match for Enter key functionality
  const getSingleMatch = () => {
    const allMatches = Object.values(filteredGroups).flat();
    return allMatches.length === 1 ? allMatches[0] : null;
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className={className}>
      {/* Search Input - Sticky at top */}
      <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-9 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 pt-2 space-y-6">
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No elements found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            Object.entries(filteredGroups).map(([group, elements]) => (
              <div key={group} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground tracking-wide">
                  {group}
                </h3>

                <Droppable
                  droppableId={`toolbar-${group}`}
                  isDropDisabled={true}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="grid grid-cols-2 gap-2"
                    >
                      {elements.map(({ type, icon: Icon, label }, index) => {
                        // Highlight matching text
                        const highlightedLabel = debouncedSearchQuery.trim() ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: label.replace(
                                new RegExp(`(${debouncedSearchQuery})`, "gi"),
                                '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>',
                              ),
                            }}
                          />
                        ) : (
                          label
                        );

                        return (
                          <Draggable
                            key={type}
                            draggableId={`toolbar-${type}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Button
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                variant="ghost"
                                className={cn(
                                  "h-auto min-h-[85px] flex flex-col items-center justify-center gap-3 p-3 rounded-md border transition-all duration-200 group relative overflow-hidden",
                                  "bg-card border-border shadow-sm hover:shadow-md",
                                  "hover:scale-[1.02] hover:-translate-y-0.5 hover:bg-accent",
                                  snapshot.isDragging &&
                                    "ring-2 ring-ring ring-offset-2 shadow-lg scale-105 bg-accent",
                                )}
                                onClick={() => createNewElement(type)}
                              >
                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                {/* Icon with background circle */}
                                <div
                                  className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                                    "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110",
                                  )}
                                >
                                  <Icon className="h-4 w-4 flex-shrink-0 text-primary transition-all duration-200 group-hover:text-primary/80" />
                                </div>

                                <span className="text-xs font-medium text-muted-foreground text-center leading-tight px-1 relative z-10 group-hover:text-foreground transition-colors duration-200">
                                  {highlightedLabel}
                                </span>
                              </Button>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

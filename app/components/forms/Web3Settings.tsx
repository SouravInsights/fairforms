import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormSettings } from "@/types/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";

interface Web3SettingsProps {
  settings: FormSettings["web3"];
  onUpdate: (settings: NonNullable<FormSettings["web3"]>) => void;
}

export function Web3Settings({ settings, onUpdate }: Web3SettingsProps) {
  const { address, isConnected } = useAccount();
  console.log("isConnected from Web3Settings:", isConnected);
  const { connect } = useConnect();

  console.log("Web3Settings rendered with:", settings);

  if (!settings) return null;

  if (!isConnected) {
    return (
      <div className="p-4 text-center">
        <Button onClick={() => connect({ connector: injected() })} size="lg">
          Connect Wallet
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your wallet to configure Web3 settings
        </p>
        {/* Add this to debug */}
        <pre className="mt-4 text-xs text-left">
          {JSON.stringify({ isConnected, address }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p>Connected: {address}</p>

          <Label>Web3 Features</Label>
          <p className="text-sm text-muted-foreground">
            Enable token gating and rewards for your form
          </p>
        </div>
        <Switch
          checked={settings.enabled}
          onCheckedChange={(enabled) =>
            onUpdate({
              ...settings,
              enabled,
            })
          }
        />
      </div>

      {settings.enabled && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Token Gating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Token Gating</Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to hold tokens to access your form
                  </p>
                </div>
                <Switch
                  checked={settings.tokenGating.enabled}
                  onCheckedChange={(enabled) =>
                    onUpdate({
                      ...settings,
                      tokenGating: {
                        ...settings.tokenGating,
                        enabled,
                      },
                    })
                  }
                />
              </div>

              {settings.tokenGating.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chain</Label>
                    <Select
                      value={settings.tokenGating.chainId.toString()}
                      onValueChange={(value) =>
                        onUpdate({
                          ...settings,
                          tokenGating: {
                            ...settings.tokenGating,
                            chainId: parseInt(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ethereum</SelectItem>
                        <SelectItem value="11155111">Sepolia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Token Type</Label>
                    <Select
                      value={settings.tokenGating.tokenType}
                      onValueChange={(value) =>
                        onUpdate({
                          ...settings,
                          tokenGating: {
                            ...settings.tokenGating,
                            tokenType: value as "ERC20" | "ERC721",
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ERC20">ERC20</SelectItem>
                        <SelectItem value="ERC721">NFT (ERC721)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Token Contract Address</Label>
                    <Input
                      placeholder="0x..."
                      value={settings.tokenGating.contractAddress || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...settings,
                          tokenGating: {
                            ...settings.tokenGating,
                            contractAddress: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Token Balance</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="1"
                      value={settings.tokenGating.minTokenBalance || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...settings,
                          tokenGating: {
                            ...settings.tokenGating,
                            minTokenBalance: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Rewards</Label>
                  <p className="text-sm text-muted-foreground">
                    Reward users for completing your form
                  </p>
                </div>
                <Switch
                  checked={settings.rewards.enabled}
                  onCheckedChange={(enabled) =>
                    onUpdate({
                      ...settings,
                      rewards: {
                        ...settings.rewards,
                        enabled,
                      },
                    })
                  }
                />
              </div>

              {settings.rewards.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chain</Label>
                    <Select
                      value={settings.rewards.chainId.toString()}
                      onValueChange={(value) =>
                        onUpdate({
                          ...settings,
                          rewards: {
                            ...settings.rewards,
                            chainId: parseInt(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ethereum</SelectItem>
                        <SelectItem value="11155111">Sepolia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Token Contract Address</Label>
                    <Input
                      placeholder="0x..."
                      value={settings.rewards.tokenAddress || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...settings,
                          rewards: {
                            ...settings.rewards,
                            tokenAddress: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reward Amount</Label>
                    <Input
                      placeholder="Amount in wei"
                      value={settings.rewards.rewardAmount || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...settings,
                          rewards: {
                            ...settings.rewards,
                            rewardAmount: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

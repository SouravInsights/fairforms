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

          {/* Token Gating */}
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

              {settings?.tokenGating.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contract Address</Label>
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

          {/* Rewards Card */}
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
                  checked={settings?.rewards.enabled}
                  onCheckedChange={(checked) =>
                    onUpdate({
                      ...settings,
                      rewards: {
                        ...settings.rewards,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>

              {settings?.rewards.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Reward Amount (in tokens)</Label>
                    <Input
                      type="number"
                      min="0"
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

export const FORM_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_FORM_TOKEN_ADDRESS as `0x${string}`;

export const formTokenAbi = [
  "function sendReward(address to, uint256 amount) external",
  "function formOperators(address) external view returns (bool)",
  "function formRewardLimits(address) external view returns (uint256)",
] as const;

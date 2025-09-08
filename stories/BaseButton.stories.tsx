import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../lib/components";
const meta = {
  title: "Example/BaseButton",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => {
    return <Button>hello</Button>;
  },
};

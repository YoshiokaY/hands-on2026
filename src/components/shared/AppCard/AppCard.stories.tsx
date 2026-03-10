import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppCard } from "./index";
import { AppButton } from "../AppButton";

const meta = {
  title: "Shared/AppCard",
  component: AppCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Card Title",
    description: "This is a description of the card content.",
    children: <p>Card body content goes here.</p>,
  },
};

export const WithAction: Story = {
  args: {
    title: "Card with Action",
    description: "This card has an action button.",
    action: <AppButton size="sm">Edit</AppButton>,
    children: <p>Card body content goes here.</p>,
  },
};

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    description: "This card has a footer section.",
    children: <p>Card body content goes here.</p>,
    footer: (
      <div className="flex gap-2">
        <AppButton variant="outline">Cancel</AppButton>
        <AppButton>Save</AppButton>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    title: "Clickable Card",
    description: "Click or press Enter to interact.",
    children: <p>This card is interactive.</p>,
    onClick: () => alert("Card clicked!"),
  },
};

export const SimpleContent: Story = {
  args: {
    children: (
      <div className="text-center">
        <p className="text-lg font-medium">Simple card</p>
        <p className="text-muted-foreground">No title or description</p>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppButton } from "./index";
import { Mail, ArrowRight } from "lucide-react";

const meta = {
  title: "Shared/AppButton",
  component: AppButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    isLoading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail data-icon="inline-start" />
        Send Email
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    children: <ArrowRight />,
    size: "icon",
    "aria-label": "Next",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AppButton size="xs">XS</AppButton>
      <AppButton size="sm">SM</AppButton>
      <AppButton size="default">Default</AppButton>
      <AppButton size="lg">LG</AppButton>
    </div>
  ),
};

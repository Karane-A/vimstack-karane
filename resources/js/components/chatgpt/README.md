# ChatGPT Components

Reusable React components for integrating ChatGPT functionality into forms and pages.

## Components

### 1. ChatGptField
A complete input/textarea field with integrated ChatGPT generation button.

```tsx
import { ChatGptField } from '@/components/chatgpt';

<ChatGptField
  value={formData.name}
  onChange={(value) => setFormData({...formData, name: value})}
  placeholder="Enter name"
  modalTitle="Generate Name"
  modalPlaceholder="Describe what kind of name you want to generate"
  type="input" // or "textarea"
  rows={3} // for textarea
  buttonText="Auto Generate"
/>
```

### 2. ChatGptButton
A standalone button that opens the ChatGPT modal.

```tsx
import { ChatGptButton } from '@/components/chatgpt';

<ChatGptButton
  onClick={() => setShowModal(true)}
  text="Generate Content"
  variant="outline"
  size="sm"
/>
```

### 3. ChatGptModal
A modal dialog for ChatGPT content generation.

```tsx
import { ChatGptModal } from '@/components/chatgpt';

<ChatGptModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onGenerate={(content) => handleGenerate(content)}
  title="AI Content Generator"
  placeholder="Describe what you want to generate..."
/>
```

## Usage in CRUD Config

For CRUD forms, use the custom field type:

```tsx
import { ChatGptField } from '@/components/chatgpt';

{
  name: 'name',
  label: t('Name'),
  type: 'custom',
  required: true,
  colSpan: 12,
  render: (field: any, formData: any, onChange: any) => {
    return React.createElement(ChatGptField, {
      value: formData.name || '',
      onChange: (value: string) => onChange('name', value),
      placeholder: t('Enter name'),
      modalTitle: 'Generate Name',
      modalPlaceholder: 'Describe the type of name you want'
    });
  }
}
```

## Backend Setup

1. Ensure ChatGPT settings are configured in your settings table
2. The route `chatgpt.generate` should be available
3. The ChatGptController handles API requests to OpenAI

## Props Reference

### ChatGptField Props
- `value: string` - Current field value
- `onChange: (value: string) => void` - Change handler
- `placeholder?: string` - Input placeholder
- `type?: 'input' | 'textarea'` - Field type (default: 'input')
- `rows?: number` - Textarea rows (default: 3)
- `className?: string` - Additional CSS classes
- `required?: boolean` - Required field
- `disabled?: boolean` - Disabled state
- `modalTitle?: string` - Modal title
- `modalPlaceholder?: string` - Modal prompt placeholder
- `buttonText?: string` - Button text (default: 'Auto Generate')
- `buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost'` - Button style

### ChatGptButton Props
- `onClick: () => void` - Click handler
- `text?: string` - Button text (default: 'Auto Generate')
- `variant?: 'default' | 'outline' | 'secondary' | 'ghost'` - Button style
- `size?: 'sm' | 'default' | 'lg'` - Button size
- `className?: string` - Additional CSS classes

### ChatGptModal Props
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close handler
- `onGenerate: (content: string) => void` - Content generation handler
- `title?: string` - Modal title
- `placeholder?: string` - Prompt input placeholder

## Examples

See `/pages/examples/chatgpt-demo.tsx` for complete usage examples.
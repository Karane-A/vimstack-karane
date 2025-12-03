import { forwardRef, useRef, useImperativeHandle } from 'react'
import { RichTextEditor, RichTextEditorRef } from './rich-text-editor'
import { Label } from './label'
import { cn } from '@/lib/utils'

interface RichTextFieldProps {
  label?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

export interface RichTextFieldRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
}

const RichTextField = forwardRef<RichTextFieldRef, RichTextFieldProps>(({
  label,
  name,
  value = '',
  onChange,
  placeholder,
  className,
  error,
  required,
  disabled = false
}, ref) => {
  const editorRef = useRef<RichTextEditorRef>(null)

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent() || '',
    setContent: (content: string) => editorRef.current?.setContent(content),
    focus: () => editorRef.current?.focus(),
  }))

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <RichTextEditor
        ref={editorRef}
        content={value}
        onChange={onChange}
        placeholder={placeholder}
        editable={!disabled}
        className={cn(
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
})

RichTextField.displayName = 'RichTextField'

export { RichTextField }
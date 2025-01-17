import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option[]>(
    options.filter((option) => value.includes(option.value))
  )

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((item) => item.value === option.value)
    
    if (isSelected) {
      const filtered = selected.filter((item) => item.value !== option.value)
      setSelected(filtered)
      onChange(filtered.map(item => item.value))
    } else {
      const newSelected = [...selected, option]
      setSelected(newSelected)
      onChange(newSelected.map(item => item.value))
    }
  }

  const handleRemove = (option: Option) => {
    const filtered = selected.filter((item) => item.value !== option.value)
    setSelected(filtered)
    onChange(filtered.map(item => item.value))
  }

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="hover:bg-secondary"
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRemove(option)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleRemove(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            placeholder={placeholder}
            className="bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[120px]"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {options.map((option) => {
                const isSelected = selected.some(
                  (item) => item.value === option.value
                )
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
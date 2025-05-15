
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast as useToastOriginal, toast } from "@/components/ui/toast/use-toast"

export interface ToasterProps extends React.ComponentPropsWithoutRef<typeof ToastProvider> {}

export const Toaster = ({ ...props }: ToasterProps) => {
  const { toasts } = useToastOriginal()

  return (
    <ToastProvider {...props}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export { useToast, toast } from "@/components/ui/toast/use-toast"

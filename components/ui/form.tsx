import * as React from 'react'
import {
    Controller,
    FormProvider,
    useFormContext,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form'

type FormFieldContextValue = {
    name: FieldPath<FieldValues>
}

type FormItemContextValue = {
    id: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    if (!fieldContext || !itemContext) {
        throw new Error('Form field components must be used inside FormField and FormItem.')
    }

    const fieldState = getFieldState(fieldContext.name, formState)

    return {
        name: fieldContext.name,
        error: fieldState.error,
        formItemId: `${itemContext.id}-form-item`,
        formDescriptionId: `${itemContext.id}-form-item-description`,
        formMessageId: `${itemContext.id}-form-item-message`,
    }
}

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={className} data-slot="form-item" {...props} />
        </FormItemContext.Provider>
    )
}

function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
    const { error, formItemId } = useFormField()

    return (
        <label
            className={className}
            data-slot="form-label"
            htmlFor={formItemId}
            data-invalid={Boolean(error)}
            {...props}
        />
    )
}

function FormControl({ children }: { children: React.ReactElement }) {
    const { error, formItemId, formMessageId } = useFormField()
    const control = children as React.ReactElement<Record<string, unknown>>

    return React.cloneElement(control, {
        id: formItemId,
        'aria-describedby': error ? formMessageId : undefined,
        'aria-invalid': Boolean(error),
        'data-slot': 'form-control',
    })
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
    const { formDescriptionId } = useFormField()

    return <p className={className} id={formDescriptionId} data-slot="form-description" {...props} />
}

function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error.message ?? '') : children

    if (!body) return null

    return (
        <p
            className={className}
            id={formMessageId}
            role={error ? 'alert' : undefined}
            data-slot="form-message"
            {...props}
        >
            {body}
        </p>
    )
}

const Form = FormProvider

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage }
'use client';

import React, { useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { X } from 'lucide-react';
import { FileUploadFieldProps } from '@/types';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const FileUploader = <T extends FieldValues>({
    control,
    name,
    label,
    acceptTypes,
    disabled,
    icon: Icon,
    placeholder,
    hint,
}: FileUploadFieldProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => {
                const isUploaded = !!value;

                const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        onChange(file);
                    }
                };

                const onRemove = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onChange(null);
                    if (inputRef.current) {
                        inputRef.current.value = '';
                    }
                };

                return (
                    <FormItem className="w-full">
                        <FormLabel className="form-label">{label}</FormLabel>
                        <FormControl>
                            <div
                                className={cn(
                                    'upload-dropzone border-2 border-dashed border-[#8B7355]/20',
                                    isUploaded && 'upload-dropzone-uploaded'
                                )}
                                onClick={() => !disabled && inputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept={acceptTypes.join(',')}
                                    className="hidden"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                    disabled={disabled}
                                />

                                {isUploaded ? (
                                    <div className="flex flex-col items-center relative w-full px-4">
                                        <p className="upload-dropzone-text line-clamp-1">{(value as File).name}</p>
                                        <button
                                            type="button"
                                            onClick={onRemove}
                                            className="upload-dropzone-remove mt-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Icon className="upload-dropzone-icon" />
                                        <p className="upload-dropzone-text">{placeholder}</p>
                                        <p className="upload-dropzone-hint">{hint}</p>
                                    </>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default FileUploader;
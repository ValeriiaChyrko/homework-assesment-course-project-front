"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {Button} from "@/components/ui/button";
import {Check, ChevronDown, X} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Combobox} from "@/components/ui/combobox";

interface GitHubBranchFormProps {
    initialData?: AttemptProgress | null;
    courseId: string;
    chapterId: string;
    assignmentId: string;
    attemptId: string;
    options: { label: string; value: string } [];
}

const formSchema = z.object({
    branchName: z.string().min(1, "Назва має містити принаймні один символ"),
});

export const GitHubBranchForm = ({
    initialData,
    courseId,
    chapterId,
    assignmentId,
    attemptId,
    options
}: GitHubBranchFormProps) => {
    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            branchName: '',
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}`, values);
            toggleEditing();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    }

    const selectedOption = options.find((option) => option.value === initialData?.brachName);

    return(
        <div className="rounded-md">
            <div className="font-medium flex items-center justify-between">
                {!isEditing && (
                    <p className={cn(
                        "text-sm",
                        !initialData?.brachName && "text-slate-900 font-semibold text-muted-foreground"
                    )}>
                        {selectedOption?.label || "Гілку не обрано"}
                    </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex items-center gap-x-2 text-xs"
                        >
                            <FormField
                                control={form.control}
                                name="branchName"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Combobox
                                                options={options}
                                                value={field.value}
                                                onChangeAction={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={!isValid || isSubmitting}
                                variant="ghost"
                                type="submit"
                            >
                                <Check className="h-4 w-4"/>
                            </Button>
                        </form>
                    </Form>
                )}
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <X className="h-4 w-4 mr-1"/>
                    ) : (
                        <ChevronDown className="h-4 w-4 mr-1"/>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default GitHubBranchForm;
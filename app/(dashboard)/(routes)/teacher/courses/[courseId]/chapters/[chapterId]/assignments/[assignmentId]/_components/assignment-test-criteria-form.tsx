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
import {FileCheck2Icon, FileJson2Icon, FolderCodeIcon, PencilIcon, SquareCheck, SquareX} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {useQueryClient} from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface ChapterDescriptionFormProps {
    initialData: {
        maxScore: number,
        maxAttemptsAmount: number,

        attemptCompilationSectionEnable: boolean,
        attemptTestsSectionEnable: boolean,
        attemptQualitySectionEnable: boolean,

        attemptCompilationMaxScore: number,
        attemptCompilationMinScore: number,

        attemptTestsMaxScore: number,
        attemptTestsMinScore: number,

        attemptQualityMaxScore: number,
        attemptQualityMinScore: number,
    };
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    maxScore: z.number().positive("Число повинно бути більше 0"),
    maxAttemptsAmount: z.number().min(1, "Число повинно бути більше 1"),

    attemptCompilationSectionEnable: z.boolean().default(false),
    attemptTestsSectionEnable: z.boolean().default(false),
    attemptQualitySectionEnable: z.boolean().default(false),

    attemptCompilationMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptCompilationMinScore: z.number(),

    attemptTestsMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptTestsMinScore: z.number(),

    attemptQualityMaxScore: z.number().positive("Число повинно бути більше 0"),
    attemptQualityMinScore: z.number(),
});

export const AssignmentTestCriteriaForm = ({ initialData, courseId, chapterId, assignmentId }: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialData
        },
        mode: "onChange",
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, values);
            await queryClient.invalidateQueries({ queryKey: ["assignment", courseId, chapterId, assignmentId] });
            toggleEditing();
            toast.success("Дані оновлено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    const [weights, setWeights] = useState({ compilation: 5, tests: 65, quality: 30 });
    const maxScore = form.watch("maxScore");
    const attemptCompilationEnabled = form.watch("attemptCompilationSectionEnable");
    const attemptTestsEnabled = form.watch("attemptTestsSectionEnable");
    const attemptQualityEnabled = form.watch("attemptQualitySectionEnable");

    const recalculateScores = useCallback(() => {
        const maxScore = form.getValues("maxScore");

        const sectionKeys = ["compilation", "tests", "quality"] as const;

        const enabledSections = sectionKeys.filter(section =>
            form.getValues(`attempt${section.charAt(0).toUpperCase() + section.slice(1)}SectionEnable` as keyof z.infer<typeof formSchema>)
        );

        const enabledWeight = enabledSections.reduce((sum, section) =>
            sum + weights[section as keyof typeof weights], 0
        );

        enabledSections.forEach(section => {
            const maxSectionScore = enabledWeight > 0
                ? Math.round((weights[section as keyof typeof weights] / enabledWeight) * maxScore)
                : 0;

            form.setValue(
                `attempt${section.charAt(0).toUpperCase() + section.slice(1)}MaxScore` as keyof z.infer<typeof formSchema>,
                maxSectionScore
            );
        });
    }, [form, weights]);

    useEffect(() => {
        recalculateScores();
    }, [weights, maxScore, attemptCompilationEnabled, attemptTestsEnabled, attemptQualityEnabled, recalculateScores]);

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Параметри тестування
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити параметри оцінювання завдання"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Змінити параметри
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="text-md mt-2 space-y-4">
                    {/* Section 1 */}
                    <div className="p-y-4">
                        <div>
                            <span className="text-slate-700">Максимальний бал:</span>
                            {initialData.maxScore ? (
                                <span className="font-semibold text-slate-700 ml-2">{initialData.maxScore}</span>
                            ) : (
                                <span className="text-slate-500 italic ml-2">100</span>
                            )}
                        </div>
                        <div>
                            <span className="text-slate-700">Кількість спроб:</span>
                            {initialData.maxAttemptsAmount ? (
                                <span className="font-semibold text-slate-700 ml-2">{initialData.maxAttemptsAmount}</span>
                            ) : (
                                <span className="text-slate-500 italic ml-2">5</span>
                            )}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptCompilationSectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptCompilationSectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступне для перервірки на компіляцію.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку на компіляцію.
                                </div>
                            )}
                        </div>
                        {initialData.attemptCompilationSectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptCompilationMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptCompilationMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptCompilationMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptCompilationMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptTestsSectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptTestsSectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступне для перервірки на відповідність тестів.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку на відповідність тестів.
                                </div>
                            )}
                        </div>
                        {initialData.attemptTestsSectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptTestsMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptTestsMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptTestsMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptTestsMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section  4 */}
                    <div className="p-4 bg-white shadow rounded-lg space-y-2">
                        <div className={cn("text-slate-700", !initialData.attemptQualitySectionEnable && "text-slate-500 italic")}>
                            {initialData.attemptQualitySectionEnable ? (
                                <div className="flex items-center">
                                    <SquareCheck className="h-4 w-4 mr-2"/>
                                    Рішення доступний для перервірки коду на якість.
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <SquareX className="h-4 w-4 mr-2"/>
                                    Рішення не буде проходити перервірку коду на якість.
                                </div>
                            )}
                        </div>
                        {initialData.attemptQualitySectionEnable && (
                            <div className="flex justify-between">
                                <div>
                                    <span className="font-medium">Максимальний бал:</span>
                                    {initialData.attemptQualityMaxScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptQualityMaxScore}</span>
                                    ) : (
                                        <span className="font-semibold">100</span>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Мінімальний бал:</span>
                                    {initialData.attemptQualityMinScore ? (
                                        <span className="font-semibold text-slate-700 ml-2">{initialData.attemptQualityMinScore}</span>
                                    ) : (
                                        <span className="font-semibold ml-2">0</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2 mt-4"
                    >
                        <Label htmlFor="maxScore" className="text-md font-bold">Максимальний бал:</Label>
                        <FormField
                            control={form.control}
                            name="maxScore"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 0"
                                            className="border border-gray-900/25"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                                recalculateScores();
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label htmlFor="maxAttemptsAmount" className="text-md font-bold">Кількість спроб:</Label>
                        <FormField
                            control={form.control}
                            name="maxAttemptsAmount"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Введіть ціле число, що перевищує 1"
                                            className="border border-gray-900/25"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value ? parseFloat(value) : 0);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attemptCompilationSectionEnable"
                            render={({ field }) => (
                                <FormItem>
                                    <Card className="p-4 flex flex-col gap-2 rounded-lg shadow-lg border border-gray-200 bg-white">
                                        <div className="flex items-center gap-3 px-4">
                                            <FolderCodeIcon className="size-8" />
                                            <div className="flex-1 px-2">
                                                <h3 className="text-md font-bold">Компіляція</h3>
                                                <p className="text-sm text-gray-600">
                                                    {form.watch("attemptCompilationMaxScore")} Балів
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Checkbox
                                                    className="h-6 w-6 border-2 border-emerald-600/80 text-emerald-600"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>% від загального балу</span>
                                            <Input
                                                value={`${weights.compilation}%`}
                                                onChange={(e) => {
                                                    const newValue = Number(e.target.value);
                                                    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                                        setWeights((prev) => ({ ...prev, compilation: newValue }));
                                                    }
                                                }}
                                                className="max-w-17 mb-2 bg-white/80 border border-gray-900/25"
                                            />
                                        </div>

                                        <Slider
                                            value={[weights.compilation]}
                                            max={100}
                                            step={1}
                                            onValueChange={(v) =>
                                                setWeights((prev) => ({ ...prev, compilation: v[0] }))
                                            }
                                            className="py-1"
                                        />

                                        <div className="leading-none text-xs text-pink-600">
                                            {Object.values(weights).reduce((sum, w) => sum + w, 0) !== 100
                                                ? "Сума всіх відсотків повинна бути 100%"
                                                : ""}
                                        </div>
                                    </Card>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="attemptTestsSectionEnable"
                            render={({ field }) => (
                                <FormItem>
                                    <Card className="p-4 flex flex-col gap-2 rounded-lg shadow-lg border border-gray-200 bg-white">
                                        <div className="flex items-center gap-3 px-4">
                                            <FileCheck2Icon className="size-8" />
                                            <div className="flex-1 px-2">
                                                <h3 className="text-md font-bold">Тестування</h3>
                                                <p className="text-sm text-gray-600">
                                                    {form.watch("attemptTestsMaxScore")} Балів
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Checkbox
                                                    className="h-6 w-6 border-2 border-emerald-600/80 text-emerald-600"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="flex items-center justify-between text-md text-gray-500">
                                            <span>% від загального балу</span>
                                            <Input
                                                value={`${weights.tests}%`}
                                                onChange={(e) => {
                                                    const newValue = Number(e.target.value);
                                                    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                                        setWeights((prev) => ({ ...prev, tests: newValue }));
                                                    }
                                                }}
                                                className="max-w-17 mb-2 bg-white/80 border border-gray-900/25"
                                            />
                                        </div>

                                        <Slider
                                            value={[weights.tests]}
                                            max={100}
                                            step={1}
                                            onValueChange={(v) =>
                                                setWeights((prev) => ({ ...prev, tests: v[0] }))
                                            }
                                            className="py-1"
                                        />

                                        <div className="leading-none text-xs text-pink-600">
                                            {Object.values(weights).reduce((sum, w) => sum + w, 0) !== 100
                                                ? "Сума всіх відсотків повинна бути 100%"
                                                : ""}
                                        </div>
                                    </Card>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attemptQualitySectionEnable"
                            render={({ field }) => (
                                <FormItem>
                                    <Card className="p-4 flex flex-col gap-2 rounded-lg shadow-lg border border-gray-200 bg-white">
                                        <div className="flex items-center gap-3 px-4">
                                            <FileJson2Icon className="size-8" />
                                            <div className="flex-1 px-2">
                                                <h3 className="text-md font-bold">Якість коду</h3>
                                                <p className="text-sm text-gray-600">
                                                    {form.watch("attemptQualityMaxScore")} Балів
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Checkbox
                                                    className="h-6 w-6 border-2 border-emerald-600/80 text-emerald-600"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="flex items-center justify-between text-md text-gray-500">
                                            <span>% від загального балу</span>
                                            <Input
                                                value={`${weights.quality}%`}
                                                onChange={(e) => {
                                                    const newValue = Number(e.target.value);
                                                    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                                        setWeights((prev) => ({ ...prev, quality: newValue }));
                                                    }
                                                }}
                                                className="max-w-17 mb-2 bg-white/80 border border-gray-900/25"
                                            />
                                        </div>

                                        <Slider
                                            value={[weights.quality]}
                                            max={100}
                                            step={1}
                                            onValueChange={(v) =>
                                                setWeights((prev) => ({ ...prev, quality: v[0] }))
                                            }
                                            className="py-1"
                                        />

                                        <div className="leading-none text-xs text-pink-600">
                                            {Object.values(weights).reduce((sum, w) => sum + w, 0) !== 100
                                                ? "Сума всіх відсотків повинна бути 100%"
                                                : ""}
                                        </div>
                                    </Card>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className={cn("mt-4")}
                            >
                                Зберегти зміни
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default AssignmentTestCriteriaForm;
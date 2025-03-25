import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from "react";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

export const ConfirmDialog = ({
                                  children,
                                  onConfirm,
                              }: ConfirmModalProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '400px',
                zIndex: 1000,
            }}>
                <AlertDialogHeader className="py-2">
                    <AlertDialogTitle> Ви дійсно впевнені? </AlertDialogTitle>
                    <AlertDialogDescription> Цю дію не можна буде скасувати. </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-end gap-4 w-full items-center">
                    <AlertDialogCancel className="w-full px-4 py-2 mb-1 bg-slate-300 border-slate-300 rounded"> Скасувати </AlertDialogCancel>
                    <AlertDialogAction className="w-full px-4 pb-2 bg-slate-800 text-white rounded" onClick={onConfirm}> Продовжити </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

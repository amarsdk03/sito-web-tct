'use client'

import {RiNotification2Line} from "@remixicon/react";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const dialogTitle = "Ultime notizie";

export default function NotificationDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="icon" aria-label={dialogTitle}>
                    <RiNotification2Line />
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} aria-describedby={dialogTitle}>
                <DialogHeader>
                    <DialogTitle>
                        {dialogTitle}
                    </DialogTitle>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <p className="my-8 italic text-center">
                        Coming soon...
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Chiudi</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

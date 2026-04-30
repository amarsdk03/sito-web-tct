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
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"

const dialogTitle = "Ultime novità";

export default function NavbarNewsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="lg" aria-label={dialogTitle}>
                    <RiNotification2Line />
                    <span className="hidden sm:block">
                        {dialogTitle}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className={"text-xl font-bold"}>
                        {dialogTitle}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {dialogTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4">
                    <p className="my-8 italic text-center">
                        Coming soon...
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Chiudi
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

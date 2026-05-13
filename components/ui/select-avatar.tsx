"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Avatar {
    id: number;
    svg: string; // svg markup as string
    alt: string;
}

const avatars: Avatar[] = [
    {
        id: 1,
        svg: `
                <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40" aria-label="Avatar 1">
                    <mask id=":r111:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                        <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#:r111:)">
                        <rect width="36" height="36" fill="#ff005b" />
                        <rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#ffb238" rx="6" />
                        <g transform="translate(4.5 -4) rotate(9 18 18)">
                            <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round" />
                            <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                            <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                        </g>
                    </g>
                </svg>
            `,
            alt: "Avatar 1",
    },
    {
        id: 2,
        svg: `
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <mask id=":R4mrttb:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#:R4mrttb:)">
                    <rect width="36" height="36" fill="#ff7d10"></rect>
                    <rect x="0" y="0" width="36" height="36" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" fill="#0a0310" rx="6" />
                    <g transform="translate(7 -6) rotate(-5 18 18)">
                        <path d="M15 20c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" stroke-linecap="round" />
                        <rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                        <rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                    </g>
                </g>
            </svg>
        `,
        alt: "Avatar 4",
    },
    {
        id: 3,
        svg: `
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <mask id=":r11c:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#:r11c:)">
                    <rect width="36" height="36" fill="#0a0310" />
                    <rect x="0" y="0" width="36" height="36" transform="translate(-3 7) rotate(227 18 18) scale(1.2)" fill="#ff005b" rx="36" />
                    <g transform="translate(-3 3.5) rotate(7 18 18)">
                        <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
                        <rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                        <rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                    </g>
                </g>
            </svg>
        `,
        alt: "Avatar 2",
    },
    {
        id: 4,
        svg: `
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <mask id=":r1gg:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#:r1gg:)">
                    <rect width="36" height="36" fill="#d8fcb3"></rect>
                    <rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#89fcb3" rx="6" />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round" />
                        <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                        <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                    </g>
                </g>
            </svg>
        `,
        alt: "Avatar 3",
    },
];

// Add these animation variants at the top level
const mainAvatarVariants = {
    initial: {
        y: 20,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
        },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const pickerVariants = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    },
    item: {
        initial: {
            y: 20,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    },
};

const selectedVariants = {
    initial: {
        opacity: 0,
        rotate: -180,
    },
    animate: {
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
    exit: {
        opacity: 0,
        rotate: 180,
        transition: {
            duration: 0.2,
        },
    },
};

// در بخش وارد کردن ماژول‌ها، دکمه را هم اضافه کنید (اگر از shadcn استفاده می‌کنید)
import { Button } from "@/components/ui/button";

interface AvatarPickerProps {
    onConfirm?: (selected: string | null) => void;
    onCancel?: () => void;
}

export default function AvatarPicker({ onConfirm, onCancel }: AvatarPickerProps) {
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
    const [rotationCount, setRotationCount] = useState(0);

    const handleAvatarSelect = (avatar: Avatar) => {
        setRotationCount((prev) => prev + 1080);
        setSelectedAvatar(avatar);
    };

    return (
        <motion.div initial="initial" animate="animate" className="w-full">
            <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-b from-background to-muted/30">
                <CardContent className="p-0">
                    {/* بخش هدر و نمایش آواتار (کد قبلی شما) */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "8rem" }}
                        className="bg-gradient-to-r from-primary/20 to-primary/10 w-full"
                    />

                    <div className="px-8 pb-8 -mt-16">
                        <motion.div
                            className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 bg-background flex items-center justify-center"
                            variants={mainAvatarVariants as any}
                            layoutId="selectedAvatar"
                        >
                            <motion.div
                                className="w-full h-full flex items-center justify-center scale-[3]"
                                animate={{ rotate: rotationCount }}
                                transition={{ duration: 0.8, ease: ([0.4, 0, 0.2, 1] as unknown) as any }}
                            >
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    dangerouslySetInnerHTML={{ __html: selectedAvatar.svg }}
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div className="text-center mt-4" variants={pickerVariants.item as any}>
                            <h2 className="text-2xl font-bold">من</h2>
                            <p className="text-muted-foreground text-sm">آواتار خودت رو انتخاب کن</p>
                        </motion.div>

                        {/* لیست انتخاب آواتارها */}
                        <motion.div className="mt-6" variants={pickerVariants.container as any}>
                            <div className="flex justify-center gap-4">
                                {avatars.map((avatar) => (
                                    <motion.button
                                        key={avatar.id}
                                        onClick={() => handleAvatarSelect(avatar)}
                                        className={cn(
                                            "relative w-12 h-12 rounded-full overflow-hidden border-2",
                                            selectedAvatar.id === avatar.id ? "border-primary" : "border-transparent"
                                        )}
                                        variants={pickerVariants.item as any}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: avatar.svg }} />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* --- بخش جدید: دکمه‌های تایید و لغو --- */}
                        <motion.div 
                            className="flex items-center gap-3 mt-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button 
                                onClick={() => {
                                    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(selectedAvatar.svg)}`;
                                    onConfirm?.(dataUrl);
                                }}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            >
                                ثبت آواتار
                            </Button>
                            <Button 
                                onClick={onCancel}
                                variant="outline"
                                className="flex-1 border-muted-foreground/20 hover:bg-muted font-medium"
                            >
                                انصراف
                            </Button>
                        </motion.div>
                        {/* ------------------------------- */}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
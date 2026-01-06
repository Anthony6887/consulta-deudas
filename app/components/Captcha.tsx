'use client';

import { useEffect, useState } from 'react';

interface CaptchaProps {
    onValidate: (ok: boolean) => void;
}

interface CaptchaState {
    n1: number;
    n2: number;
}

function generarCaptcha(): CaptchaState {
    return {
        n1: Math.floor(Math.random() * 9) + 1,
        n2: Math.floor(Math.random() * 9) + 1,
    };
}

export default function Captcha({ onValidate }: CaptchaProps) {
    const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
    const [value, setValue] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCaptcha(generarCaptcha());
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!captcha) return;
        onValidate(Number(value) === captcha.n1 + captcha.n2);
    }, [value, captcha, onValidate]);

    if (!mounted || !captcha) return null;

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">
                CAPTCHA: ¿{captcha.n1} + {captcha.n2}?
            </label>

            <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
            />
        </div>
    );
}

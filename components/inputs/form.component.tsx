'use client';
import { Input } from '@nextui-org/react';
import { 
    FC,
    InputHTMLAttributes,
    useState
} from 'react';

import {
    AiFillEye,
    AiFillEyeInvisible
} from 'react-icons/ai';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: any;
    isError?: boolean;
    formType?: "Default" | "Variant";
    isRequerid?: boolean;
    onValueChange?: (value: string) => void;
    isDisabled?: boolean
    defaultValue?: string;
}

export const Form: FC<InputProps> = ({ icon, isError, isRequerid, formType, onValueChange, isDisabled, defaultValue, ...props }) => {
    const [isPassword, setVisiblePassword] = useState(false);
    const PasswordButton = () =>
        isPassword ? <AiFillEyeInvisible /> : <AiFillEye />;
    const Icon = icon;

    if(!formType || formType === "Default")
        return (
            <div className={`relative flex items-center gap-3 w-full border-b transition-all ${isError ? "border-b-red-500" :  "focus-within:border-b-black border-b-stone-300"}`}>
                {icon ? <Icon /> : <></>}
                <input
                    className={`peer h-full w-full outline-none bg-transparent text-sm font-normal py-4 + ${props.className}`}
                    {...props}
                    type={isPassword ? 'text' : props.type}
                />
                {props.type === 'password' && (
                    <button
                        onClick={() => setVisiblePassword((s) => !s)}
                        type="button"
                        className="p-3"
                    >
                        <PasswordButton />
                    </button>
                )}
            </div>
        );
    else if(formType === "Variant") {
        return <Input
            classNames={{
                inputWrapper: "bg-white rounded-lg"
            }}
            size='lg'
            radius='lg'
            variant='bordered'
            className={props.className}
            endContent={
                props.type === 'password' && 
                (
                    <button
                        onClick={() => setVisiblePassword((s) => !s)}
                        type="button"
                        className="p-3"
                    >
                        <PasswordButton />
                    </button>
                )
            }
            placeholder={props.placeholder}
            type={isPassword ? 'text' : props.type}
            label={props.name}
            isRequired={isRequerid}
            isInvalid={isError}
            onValueChange={onValueChange}
            isDisabled={isDisabled}
            defaultValue={defaultValue}
        />
    }
};
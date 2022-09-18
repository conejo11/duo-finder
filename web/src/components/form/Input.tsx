import { FC, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> 
 
const Input: FC<InputProps> = (props) => {
  return ( 
    <input 
      className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500' 
      {...props} 
    /> 
  );
}
 
export default Input;
import { CheckIcon, X } from 'lucide-react';

const passwordRequirements = [
  { regex: /[A-Z]/, message: 'Uma letra maiúscula' },
  { regex: /[a-z]/, message: 'Uma letra minúscula' },
  { regex: /\d/, message: 'Um número' },
  { regex: /[^a-zA-Z0-9]/, message: 'Um caractere especial' },
  { regex: /.{8,}/, message: 'Pelo menos 8 caracteres' },
];

export default function StrongPasswordFeedback({
  password,
  confirmPassword,
}: Readonly<{
  password: string;
  confirmPassword: string;
}>) {
  const isEqual = password && confirmPassword && password === confirmPassword;

  return (
    <div className="mt-2 flex flex-col gap-2 text-sm/6 text-gray-700">
      <p className="text-sm/6 font-semibold text-gray-700">A senha deve conter:</p>
      <ul className="list-disc">
        {passwordRequirements.map((req, index) => (
          <li
            key={index}
            className={`flex items-center ${req.regex.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
            {req.regex.test(password) ? (
              <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <X className="mr-2 h-4 w-4 text-gray-400" />
            )}{' '}
            {req.message}
          </li>
        ))}
        <li className={`flex items-center ${isEqual ? 'text-green-500' : 'text-gray-400'}`}>
          {isEqual ? (
            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <X className="mr-2 h-4 w-4 text-gray-400" />
          )}{' '}
          {isEqual ? 'As senhas coincidem' : 'As senhas não coincidem'}
        </li>
      </ul>
    </div>
  );
}

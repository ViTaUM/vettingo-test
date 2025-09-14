'use client';

import FormCheckbox from '@/components/form/checkbox';
import FormDateSelector from '@/components/form/date-selector';
import HookFormField from '@/components/form/hook-form-field';
import HookFormPasswordField from '@/components/form/hook-form-password-field';
import FormPhoneInput from '@/components/form/phone-input';
import FormSelect from '@/components/form/select';
import StrongPasswordFeedback from '@/components/form/strong-password-feedback';
import UIButton from '@/components/ui/button';
import { registerAction } from '@/lib/api/auth';
import { User } from '@/lib/types/api';
import { cleanFormattedValue } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import AccountTypeSelector from './account-type-selector';

interface RegisterState {
  success?: boolean;
  error?: string;
  user?: User;
}

const registerSchema = z.object({
  firstName: z.string().min(2, 'Primeiro nome deve ter pelo menos 2 caracteres').max(50, 'Primeiro nome deve ter no máximo 50 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres').max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF deve ter no máximo 14 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'USER' | 'VETERINARIAN'>('USER');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [countryCode, setCountryCode] = useState('55');
  const [areaCode, setAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dataProcessingAgreement, setDataProcessingAgreement] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  const [state, action, isPending] = useActionState(
    async (_: RegisterState | null, formData: FormData): Promise<RegisterState> => {
      const email = formData.get('email') as string;
      const userPassword = formData.get('password') as string;
      const userFirstName = formData.get('firstName') as string;
      const userLastName = formData.get('lastName') as string;
      const phoneNumber = formData.get('phoneNumber') as string;
      const phoneDDD = formData.get('areaCode') as string;
      const phoneDDI = formData.get('countryCode') as string;
      const userBirthDate = formData.get('dateOfBirth') as string;
      const userGender = formData.get('gender') as 'M' | 'F' | 'O';
      const userWantsNewsletter = formData.get('wantsNewsletter') === 'on';
      const dataProcessingAgreement = formData.get('dataProcessingAgreement') === 'on';
      const role = formData.get('role') as 'USER' | 'VETERINARIAN';
      const userCpf = formData.get('cpf') as string;

      if (!dataProcessingAgreement) {
        return {
          success: false,
          error: 'É necessário aceitar os termos de processamento de dados para continuar',
        };
      }

      const result = await registerAction({
        email,
        userPassword,
        userFirstName,
        userLastName,
        phoneNumber: cleanFormattedValue(phoneNumber),
        phoneDDD: cleanFormattedValue(phoneDDD),
        phoneDDI: cleanFormattedValue(phoneDDI),
        userBirthDate,
        userGender,
        userWantsNewsletter,
        userCpf: cleanFormattedValue(userCpf),
        role: role,
      });

      if (result.success) {
        toast.success('Conta criada com sucesso!');
        router.push('/login?message=Conta criada com sucesso! Faça seu login.');
        return result;
      } else {
        toast.error(result.error || 'Erro ao criar conta');
        return result;
      }
    },
    null,
  );

  const onSubmit = (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('cpf', data.cpf);
    formData.append('phoneNumber', phoneNumber);
    formData.append('areaCode', areaCode);
    formData.append('countryCode', countryCode);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);
    formData.append('wantsNewsletter', wantsNewsletter ? 'on' : '');
    formData.append('dataProcessingAgreement', dataProcessingAgreement ? 'on' : '');
    formData.append('role', accountType);
    startTransition(() => {
      action(formData);
    });
  };

  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  return (
    <div className="space-y-8">
      <AccountTypeSelector value={accountType} onChange={setAccountType} disabled={isPending} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Pessoais</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <HookFormField
              label="Primeiro Nome"
              name="firstName"
              type="text"
              placeholder="Digite seu primeiro nome"
              control={control}
              error={errors.firstName?.message}
              required
              disabled={isPending}
            />
            <HookFormField
              label="Sobrenome"
              name="lastName"
              type="text"
              placeholder="Digite seu sobrenome"
              control={control}
              error={errors.lastName?.message}
              required
              disabled={isPending}
            />
            <HookFormField
              label="CPF"
              name="cpf"
              type="text"
              placeholder="Digite seu CPF"
              control={control}
              error={errors.cpf?.message}
              required
              disabled={isPending}
              mask="cpf"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormDateSelector
              label="Data de Nascimento"
              name="dateOfBirth"
              value={dateOfBirth}
              required
              maxYear={new Date().getFullYear() - 18}
              disabled={isPending}
              onChange={(value) => setDateOfBirth(value)}
            />

            <FormSelect
              label="Gênero"
              name="gender"
              value={gender}
              required
              options={genderOptions}
              disabled={isPending}
              onChange={(value) => setGender(value)}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Informações de Contato</h3>

          <HookFormField
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            control={control}
            error={errors.email?.message}
            required
            disabled={isPending}
          />

          <div className="mt-4">
            <FormPhoneInput
              label="Telefone"
              countryCodeName="countryCode"
              areaCodeName="areaCode"
              phoneName="phoneNumber"
              countryCodeValue={countryCode}
              areaCodeValue={areaCode}
              phoneValue={phoneNumber}
              required
              disabled={isPending}
              onChange={(field, value) => {
                if (field === 'countryCode') {
                  setCountryCode(value);
                } else if (field === 'areaCode') {
                  setAreaCode(value);
                } else if (field === 'phoneNumber') {
                  setPhoneNumber(value);
                }
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Segurança da Conta</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <HookFormPasswordField
              label="Senha"
              name="password"
              placeholder="Digite sua senha"
              control={control}
              error={errors.password?.message}
              required
              disabled={isPending}
              showStrength={true}
            />
            <HookFormPasswordField
              label="Confirmar Senha"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              control={control}
              error={errors.confirmPassword?.message}
              required
              disabled={isPending}
              showStrength={false}
            />
          </div>

          <div className="mt-4">
            <StrongPasswordFeedback password={watchedPassword} confirmPassword={watchedConfirmPassword} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Termos e Preferências</h3>

          <div className="space-y-4">
            <FormCheckbox
              name="dataProcessingAgreement"
              label="Autorizo a Vettingo a processar meus dados pessoais para fins de cadastro e uso da plataforma."
              value={dataProcessingAgreement}
              disabled={isPending}
              onChange={(value) => setDataProcessingAgreement(value)}
            />

            <FormCheckbox
              name="wantsNewsletter"
              label="Desejo receber novidades, promoções e dicas por e-mail."
              value={wantsNewsletter}
              disabled={isPending}
              onChange={(value) => setWantsNewsletter(value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <UIButton
            type="submit"
            size="sm"
            variant="solid"
            className={`w-full ${
              accountType === 'VETERINARIAN'
                ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
            loading={isPending}
            disabled={isPending || !isValid || !dataProcessingAgreement}>
            {isPending
              ? 'Criando conta...'
              : accountType === 'VETERINARIAN'
                ? 'Criar conta profissional'
                : 'Criar conta'}
          </UIButton>

          {state?.error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="/termos-de-uso" className="text-blue-600 hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="/politica-de-privacidade" className="text-blue-600 hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}


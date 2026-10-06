import { useForm } from 'react-hook-form';
import { useSession } from '../session/context';

type LoginForm = { email: string; password: string };

export function useLogin() {
  const { signIn } = useSession();
  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const submit = async ({ email, password }: LoginForm) => {
    try {
      await signIn(email, password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return {
    control,
    submit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    error: formState.errors.root?.message ?? null,
  };
}

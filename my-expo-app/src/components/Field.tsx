import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
};

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...input
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1">
          <Text className="text-bento-body font-semibold text-oficiar-very-dark">{label}</Text>
          <TextInput
            accessibilityLabel={label}
            className={`min-h-toque rounded-bento-sm border bg-white px-bento-in text-bento-body text-oficiar-very-dark ${error ? 'border-peligro' : 'border-oficiar-dark/20'}`}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            {...input}
          />
          {!!error && <Text className="text-bento-label text-peligro">{error.message}</Text>}
        </View>
      )}
    />
  );
}

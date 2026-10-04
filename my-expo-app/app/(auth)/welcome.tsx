import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Button from '../../src/components/Button';
import Logo from '../../src/components/Logo';

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center gap-10 bg-oficiar-gray px-6 pb-10">
      <View className="items-center gap-3">
        <Logo size="lg" />
        <Text className="text-center text-base text-oficiar-very-dark">
          Soluciones{' '}
          <Text className="font-bold text-oficiar-blue">profesionales</Text>
          {'\n'}para tu hogar{' '}
          <Text className="font-bold text-oficiar-blue">al instante</Text>
        </Text>
      </View>

      <View className="gap-3">
        <Button
          text="Hazte Cliente"
          onPress={() => router.push('/register?role=CLIENT')}
        />
        <Button
          text="Hazte Officer"
          variant="yellow"
          onPress={() => router.push('/register?role=WORKER')}
        />
      </View>

      <Button
        text="Iniciar Sesión"
        variant="secondary"
        onPress={() => router.push('/login')}
      />
    </View>
  );
}

import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { AccionSolicitud } from '../api/solicitudes';
import Button from '../components/Button';
import SolicitudCard from '../components/SolicitudCard';
import { useSolicitudes } from '../hooks/useSolicitudes';
import { neutro } from '../theme/tokens';
import type { Solicitud } from '../types';
import { router, useLocalSearchParams } from 'expo-router';

// Vista 3: la misma pantalla para cliente y officer; los botones cambian según rol y estado
export default function Solicitudes() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    esOfficer,
    solicitudes,
    loading,
    refreshing,
    error,
    procesandoId,
    recargar,
    reintentar,
    cotizar,
    cambiarEstado,
    cerrarSolicitud,
  } = useSolicitudes();

  const visibles = id
    ? solicitudes.filter((s) => String(s.id) === id)
    : solicitudes;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-oficiar-gray">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-bento bg-oficiar-gray p-bento-in">
        <Text className="text-center text-bento-body text-oficiar-dark">{error}</Text>
        <Button
          text="Reintentar"
          icono="refresh"
          variant="secondary"
          onPress={reintentar}
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-oficiar-gray"
      data={visibles}
      keyExtractor={(s) => String(s.id)}
      contentContainerClassName="gap-bento p-bento-in pb-10"
      refreshing={refreshing}
      onRefresh={recargar}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ 
        id && visibles.length > 0 ? (
          <Button
            text="Ver todas"
            icono="list-outline"
            variant="secondary"
            onPress={() => router.replace('/solicitudes')}
          />
        ) : undefined
      }
      ListEmptyComponent={
        id ? (                                               
          <View className="mt-10 items-center gap-bento">
            <Text className="text-center text-bento-body text-oficiar-dark">
              Esta solicitud no está en tu cuenta.
            </Text>
            <Button
              text="Ver todas"
              icono="list-outline"
              variant="secondary"
              onPress={() => router.replace('/solicitudes')}
            />
          </View>
        ) : (
        <Text className="mt-10 text-center text-bento-body text-oficiar-dark">
          {esOfficer
            ? 'Todavía no te han llegado solicitudes.'
            : 'Todavía no has hecho solicitudes. Pide un servicio desde el inicio.'}
        </Text>
        )
      }
      renderItem={({ item }) => (
        <SolicitudCard solicitud={item} esOfficer={esOfficer}>
          <Acciones
            solicitud={item}
            esOfficer={esOfficer}
            procesando={procesandoId === item.id}
            cotizar={cotizar}
            cambiarEstado={cambiarEstado}
            cerrarSolicitud={cerrarSolicitud}
          />
        </SolicitudCard>
      )}
    />
  );
}

interface AccionesProps {
  solicitud: Solicitud;
  esOfficer: boolean;
  procesando: boolean;
  cotizar: (id: number, precio: number) => void;
  cambiarEstado: (id: number, accion: AccionSolicitud) => void;
  cerrarSolicitud: (id: number, accion: 'rechazar' | 'cancelar') => void;
}

// Botones según rol y estado (las mismas reglas que la máquina de estados del backend)
function Acciones({
  solicitud,
  esOfficer,
  procesando,
  cotizar,
  cambiarEstado,
  cerrarSolicitud,
}: AccionesProps) {
  const [precio, setPrecio] = useState('');
  const { id, estado } = solicitud;

  // Rechazar y cancelar cierran la solicitud: se pide confirmación
  const confirmar = (accion: 'rechazar' | 'cancelar') => cerrarSolicitud(id, accion);

  if (procesando) return <ActivityIndicator />;

  if (esOfficer) {
    if (estado === 'PENDIENTE') {
      return (
        <View className="gap-2">
          <TextInput
            className="min-h-toque rounded-bento-sm border border-oficiar-dark/20 px-bento-in text-bento-body text-oficiar-very-dark"
            placeholder="Precio del servicio (ej: 50000)"
            placeholderTextColor={neutro.placeholder}
            keyboardType="number-pad"
            value={precio}
            onChangeText={(t) => setPrecio(t.replace(/[^0-9]/g, ''))}
          />
          <Button
            text="Cotizar"
            icono="pricetag-outline"
            onPress={() => cotizar(id, Number(precio))}
            disabled={!precio}
          />
          <Button
            text="Rechazar" icono="close-circle-outline"
            variant="danger"
            onPress={() => confirmar('rechazar')}
          />
        </View>
      );
    }

    if (estado === 'COTIZADA') {
      return <Aviso texto="Esperando la respuesta del cliente." />;
    }

    if (estado === 'ACEPTADA') {
      return (
        <Button
          text="Iniciar trabajo"
          icono="play-outline"
          onPress={() => cambiarEstado(id, 'iniciar')}
        />
      );
    }

    if (estado === 'EN_CURSO') {
      return <Aviso texto="Trabajo en curso. El cliente lo finaliza." />;
    }

    return null;
  }

  // Cliente
  if (estado === 'PENDIENTE') {
    return (
      <View className="gap-2">
        <Aviso texto="Esperando la cotización del officer." />
        <Button
          text="Cancelar" icono="close-outline"
          variant="secondary"
          onPress={() => confirmar('cancelar')}
        />
      </View>
    );
  }

  if (estado === 'COTIZADA') {
    return (
      <View className="gap-2">
        <Button
          text="Aceptar precio"
          icono="checkmark-circle-outline"
          onPress={() => cambiarEstado(id, 'aceptar')}
        />
        <Button
          text="Rechazar" icono="close-circle-outline"
          variant="danger"
          onPress={() => confirmar('rechazar')}
        />
        <Button
          text="Cancelar" icono="close-outline"
          variant="secondary"
          onPress={() => confirmar('cancelar')}
        />
      </View>
    );
  }

  if (estado === 'ACEPTADA') {
    return (
      <View className="gap-2">
        <Aviso texto="Esperando que el officer inicie el trabajo." />
        <Button
          text="Cancelar" icono="close-outline"
          variant="secondary"
          onPress={() => confirmar('cancelar')}
        />
      </View>
    );
  }

  if (estado === 'EN_CURSO') {
    return (
      <Button
        text="Finalizar"
        icono="flag-outline"
        onPress={() => cambiarEstado(id, 'finalizar')}
      />
    );
  }

  return null;
}

function Aviso({ texto }: { texto: string }) {
  return <Text className="text-bento-label text-oficiar-dark">{texto}</Text>;
}


import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { AccionSolicitud } from '../api/solicitudes';
import Button from '../components/Button';
import { useSolicitudes } from '../hooks/useSolicitudes';
import type { Solicitud } from '../types';

// Vista 3: la misma pantalla para cliente y officer; los botones cambian según rol y estado
export default function Solicitudes() {
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
  } = useSolicitudes();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-oficiar-gray">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-oficiar-gray p-6">
        <Text className="text-center text-oficiar-dark">{error}</Text>
        <Button
          text="Reintentar"
          variant="secondary"
          onPress={reintentar}
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-oficiar-gray"
      data={solicitudes}
      keyExtractor={(s) => String(s.id)}
      contentContainerClassName="gap-3 p-4 pb-10"
      refreshing={refreshing}
      onRefresh={recargar}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <Text className="mt-10 text-center text-neutral-500">
          {esOfficer
            ? 'Todavía no te han llegado solicitudes.'
            : 'Todavía no has hecho solicitudes. Pide un servicio desde el inicio.'}
        </Text>
      }
      renderItem={({ item }) => (
        <TarjetaProvisional solicitud={item} esOfficer={esOfficer}>
          <Acciones
            solicitud={item}
            esOfficer={esOfficer}
            procesando={procesandoId === item.id}
            cotizar={cotizar}
            cambiarEstado={cambiarEstado}
          />
        </TarjetaProvisional>
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
}

// Botones según rol y estado (las mismas reglas que la máquina de estados del backend)
function Acciones({
  solicitud,
  esOfficer,
  procesando,
  cotizar,
  cambiarEstado,
}: AccionesProps) {
  const [precio, setPrecio] = useState('');
  const { id, estado } = solicitud;

  // Rechazar y cancelar cierran la solicitud: se pide confirmación
  const confirmar = (accion: 'rechazar' | 'cancelar') =>
    Alert.alert(
      accion === 'rechazar' ? 'Rechazar solicitud' : 'Cancelar solicitud',
      'Esta acción cierra la solicitud. ¿Continuar?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: () => cambiarEstado(id, accion),
        },
      ],
    );

  if (procesando) return <ActivityIndicator />;

  if (esOfficer) {
    if (estado === 'PENDIENTE') {
      return (
        <View className="gap-2">
          <TextInput
            className="rounded-lg border border-neutral-300 px-3 py-3"
            placeholder="Precio del servicio (ej: 50000)"
            keyboardType="number-pad"
            value={precio}
            onChangeText={(t) => setPrecio(t.replace(/[^0-9]/g, ''))}
          />
          <Button
            text="Cotizar"
            onPress={() => cotizar(id, Number(precio))}
            disabled={!precio}
          />
          <Button
            text="Rechazar"
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
          text="Cancelar"
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
          onPress={() => cambiarEstado(id, 'aceptar')}
        />
        <Button
          text="Rechazar"
          variant="danger"
          onPress={() => confirmar('rechazar')}
        />
        <Button
          text="Cancelar"
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
          text="Cancelar"
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
        onPress={() => cambiarEstado(id, 'finalizar')}
      />
    );
  }

  return null;
}

function Aviso({ texto }: { texto: string }) {
  return <Text className="text-sm text-neutral-500">{texto}</Text>;
}

// PROVISIONAL: cuando Triana suba SolicitudCard, se reemplaza por
// <SolicitudCard solicitud={item} esOfficer={esOfficer}> ...Acciones... </SolicitudCard>
// y se borra esta función.
function TarjetaProvisional({
  solicitud,
  esOfficer,
  children,
}: {
  solicitud: Solicitud;
  esOfficer: boolean;
  children?: ReactNode;
}) {
  const persona = esOfficer
    ? solicitud.clienteNombre
    : solicitud.officerNombre;

  const precio =
    solicitud.precioAcordado != null
      ? `$${solicitud.precioAcordado.toLocaleString('es-CO')}`
      : 'Por cotizar';

  return (
    <View className="gap-2 rounded-2xl bg-white p-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-lg font-bold text-oficiar-very-dark">
          {solicitud.oficio}
        </Text>
        <Text className="font-semibold text-oficiar-blue-btn">
          {solicitud.estado}
        </Text>
      </View>

      <Text className="text-oficiar-dark">{solicitud.descripcion}</Text>

      <Text className="text-sm text-neutral-500">
        {esOfficer ? 'Cliente' : 'Officer'}: {persona} · Precio: {precio}
      </Text>

      {!!solicitud.direccion && (
        <Text className="text-sm text-neutral-500">
          Dirección: {solicitud.direccion}
        </Text>
      )}

      {children}
    </View>
  );
}

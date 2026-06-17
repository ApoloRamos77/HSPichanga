import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partidosService, reservasService } from '../services/api';
import { Calendar, Users, Loader2 } from 'lucide-react';

export const PartidosPage = () => {
  const queryClient = useQueryClient();
  const [selectedPartido, setSelectedPartido] = useState<any>(null);

  const { data: partidos, isLoading, error } = useQuery({
    queryKey: ['partidos-admin'],
    queryFn: () => partidosService.getAllAdmin().then((r: any) => r.data),
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) return false;
      return failureCount < 2;
    }
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string, estado: number }) => 
      partidosService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidos-admin'] });
      setSelectedPartido(null);
    }
  });

  const confirmarPagoMutation = useMutation({
    mutationFn: (reservaId: string) => reservasService.confirmarPago(reservaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partidos-admin'] })
  });

  const rechazarPagoMutation = useMutation({
    mutationFn: (reservaId: string) => reservasService.rechazarPago(reservaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partidos-admin'] })
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" /></div>;

  if (error) {
    const isAuthError = (error as any).response?.status === 401;
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)' }}>
        <p style={{ fontSize: '1.25rem' }}>{isAuthError ? 'Tu sesión ha expirado' : 'Error al cargar partidos'}</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>{(error as any).message}</p>
        {isAuthError && <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="premium-btn" style={{ marginTop: '16px' }}>Ir al Login</button>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Control de Partidos</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Gestiona los amistosos y ve quiénes están inscritos</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPartido ? '1fr 350px' : '1fr', gap: '24px', transition: 'all 0.3s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {partidos?.map((p: any) => (
            <div 
              key={p.id} 
              className={`premium-card glass ${selectedPartido?.id === p.id ? 'active' : ''}`}
              style={{ cursor: 'pointer', border: selectedPartido?.id === p.id ? '2px solid var(--primary)' : '1px solid var(--border)' }}
              onClick={() => setSelectedPartido(p)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  backgroundColor: p.estado === 'Abierto' ? '#22c55e22' : '#64748b22',
                  color: p.estado === 'Abierto' ? '#22c55e' : '#64748b'
                }}>
                  {p.estado}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>#{p.id.substring(0,8)}</span>
              </div>
              
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px' }}>{p.canchaNombre}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <Calendar size={14} style={{ marginRight: '4px' }} /> {new Date(p.fechaHora).toLocaleString()}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--primary)" />
                  <span style={{ fontWeight: '600' }}>{p.cuposTotales - p.cuposDisponibles} / {p.cuposTotales}</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  S/ {p.cuotaIndividual.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPartido && (
          <aside className="premium-card glass" style={{ position: 'sticky', top: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Detalle</h2>
              <button onClick={() => setSelectedPartido(null)} style={{ color: 'var(--text-muted)' }}>Cerrar</button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Organizador</p>
              <p style={{ fontWeight: '600' }}>{selectedPartido.organizadorNombre}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Reservas e Inscritos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPartido.reservas && selectedPartido.reservas.length > 0 ? (
                  selectedPartido.reservas.map((r: any, i: number) => (
                    <div key={r.reservaId || i} style={{ 
                      padding: '12px', 
                      backgroundColor: r.estadoPago === 'EnVerificacion' ? 'rgba(234, 179, 8, 0.1)' : 'var(--surface-light)', 
                      borderLeft: r.estadoPago === 'EnVerificacion' ? '4px solid #eab308' : 'none',
                      borderRadius: '6px', 
                      fontSize: '0.875rem' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1rem' }}>{i + 1}. {r.jugadorNombre}</strong>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          backgroundColor: r.estadoPago === 'EnVerificacion' ? '#eab30822' : '#22c55e22',
                          color: r.estadoPago === 'EnVerificacion' ? '#eab308' : '#22c55e'
                        }}>
                          {r.estadoPago}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                        <div>Método: {r.metodoPago || 'No especificado'}</div>
                        {r.numeroOperacion && <div>Operación: <strong style={{color: 'var(--text-primary)'}}>{r.numeroOperacion}</strong></div>}
                      </div>
                      
                      {r.estadoPago === 'EnVerificacion' && selectedPartido.estado !== 'Finalizado' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          {r.evidenciaPagoUrl && (
                            <button 
                              className="premium-btn" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--primary)' }}
                              onClick={() => window.open(r.evidenciaPagoUrl, '_blank')}
                            >
                              Ver Voucher
                            </button>
                          )}
                          <button 
                            className="premium-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--success)' }}
                            onClick={() => confirmarPagoMutation.mutate(r.reservaId)}
                            disabled={confirmarPagoMutation.isPending}
                          >
                            Confirmar
                          </button>
                          <button 
                            className="premium-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--danger)' }}
                            onClick={() => rechazarPagoMutation.mutate(r.reservaId)}
                            disabled={rechazarPagoMutation.isPending}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No hay inscritos aún</p>
                )}
              </div>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Acciones rápidas</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPartido.estado === 'Abierto' && (
                  <button 
                    className="premium-btn" 
                    style={{ width: '100%', backgroundColor: 'var(--danger)' }}
                    onClick={() => updateEstadoMutation.mutate({ id: selectedPartido.id, estado: 3 })}
                  >
                    Cancelar Partido
                  </button>
                )}
                {selectedPartido.estado === 'Abierto' && (
                   <button 
                    className="premium-btn" 
                    style={{ width: '100%', backgroundColor: 'var(--success)' }}
                    onClick={() => updateEstadoMutation.mutate({ id: selectedPartido.id, estado: 4 })}
                  >
                    Marcar Finalizado
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};


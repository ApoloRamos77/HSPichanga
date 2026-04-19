import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partidosService } from '../services/api';
import { Calendar, Users, ListFilter, Loader2, Info } from 'lucide-react';

export const PartidosPage = () => {
  const queryClient = useQueryClient();
  const [selectedPartido, setSelectedPartido] = useState<any>(null);

  const { data: partidos, isLoading } = useQuery({
    queryKey: ['partidos-admin'],
    queryFn: () => partidosService.getAllAdmin().then(r => r.data)
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string, estado: number }) => 
      partidosService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidos-admin'] });
      setSelectedPartido(null);
    }
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Control de Partidos</h1>
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
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Jugadores Inscritos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPartido.jugadores && selectedPartido.jugadores.length > 0 ? (
                  selectedPartido.jugadores.map((name: string, i: number) => (
                    <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--surface-light)', borderRadius: '6px', fontSize: '0.875rem' }}>
                      {i + 1}. {name}
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

import { useEffect, useState } from 'react';
import { fetchPaises, createPais, updatePais } from '../../lib/api';

export default function AdminPaises() {
	const [paises, setPaises] = useState([]);
	const [loading, setLoading] = useState(false);
		const [editingId, setEditingId] = useState(null);
		const [name, setName] = useState('');
		const [codigo, setCodigo] = useState('');
		const [totalHabitantes, setTotalHabitantes] = useState('');

	async function load() {
		setLoading(true);
		try {
			const res = await fetchPaises();
			setPaises(res || []);
		} catch (e) {
			console.error('Error cargando países:', e);
			alert('Error cargando países');
		}
		setLoading(false);
	}

	useEffect(() => { load(); }, []);

	function startEdit(p) {
		setEditingId(p.id_pais);
			setName(p.nombre_pais || '');
			setCodigo(p.codigo ?? '');
			setTotalHabitantes(p.total_habitantes ?? '');
	}

	function reset() {
		setEditingId(null);
		setName('');
			setCodigo('');
			setTotalHabitantes('');
	}

	async function handleSubmit(e) {
		e.preventDefault();
			try {
				const payload = { nombre_pais: name };
				if (codigo !== '') payload.codigo = codigo;
				if (totalHabitantes !== '') payload.total_habitantes = Number(totalHabitantes);

				if (editingId) await updatePais(editingId, payload);
				else await createPais(payload);
			await load(); reset();
		} catch (err) {
			console.error(err);
			alert('Error guardando país');
		}
	}

			// Deletion disabled by API / policy: countries cannot be removed via UI.

	return (
		<div>
			<h3>Países</h3>
			{loading ? <div>Cargando...</div> : (
				<div style={{ display: 'flex', gap: 20 }}>
					<div style={{ flex: 1 }}>
						<ul>
							{paises.map(p => (
								<li key={p.id_pais} style={{ marginBottom: 6 }}>
									{p.nombre_pais} (id: {p.id_pais}) {' '}
									  <button onClick={() => startEdit(p)}>Editar</button>
								</li>
							))}
						</ul>
					</div>

					<div style={{ width: 420 }}>
						<form onSubmit={handleSubmit}>
											<div>
												<label>Nombre país</label>
												<input value={name} onChange={(e) => setName(e.target.value)} required />
											</div>
											<div>
												<label>Código</label>
												<input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="p.ej. AR, CL" />
											</div>
											<div>
												<label>Total habitantes</label>
												<input type="number" value={totalHabitantes} onChange={(e) => setTotalHabitantes(e.target.value)} placeholder="p.ej. 45000000" />
											</div>
							<div style={{ marginTop: 8 }}>
								<button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
								{editingId && <button type="button" onClick={reset}>Cancelar</button>}
							</div>
						</form>
						<p style={{ color: '#666', marginTop: 12 }}>Editar o crear países. Cuidado al eliminar: puede afectar datos relacionados.</p>
					</div>
				</div>
			)}
		</div>
	);
}


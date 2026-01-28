import { useEffect, useState } from 'react';
import { fetchPaises } from '../../lib/api';

export default function AdminPaises() {
	const [paises, setPaises] = useState([]);
	const [loading, setLoading] = useState(false);

	async function load() {
		setLoading(true);
		try {
			const res = await fetchPaises();
			setPaises(res || []);
		} catch (e) {
			console.error('Error cargando países:', e);
		}
		setLoading(false);
	}

	useEffect(() => { load(); }, []);

	return (
		<div>
			<h3>Países</h3>
			{loading ? <div>Cargando...</div> : (
				<ul>
					{paises.map(p => (
						<li key={p.id_pais}>{p.nombre_pais} (id: {p.id_pais})</li>
					))}
				</ul>
			)}
			<p style={{ color: '#666', marginTop: 12 }}>Nota: Operaciones de creación/edición requieren endpoints en el backend.</p>
		</div>
	);
}


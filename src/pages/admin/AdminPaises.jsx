import { useEffect, useState } from 'react';
import styles from './AdminIndex.module.css';
import cardStyles from '../../components/AdminCard.module.css';
import AdminCard from '../../components/AdminCard';
import { fetchPaises, createPais, updatePais } from '../../lib/api';

export default function AdminPaises() {
	const [paises, setPaises] = useState([]);
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState('');
	const [openCreate, setOpenCreate] = useState(false);

	async function load() {
		setLoading(true);
		try {
			const res = await fetchPaises();
			setPaises(res || []);
		} catch (e) { console.error('Error cargando países:', e); alert('Error cargando países'); }
		setLoading(false);
	}

	useEffect(() => { load(); }, []);

	async function handleUpdate(item, values) {
		const payload = { nombre_pais: values.nombre_pais };
		if (values.codigo !== undefined) payload.codigo = values.codigo;
		if (values.total_habitantes !== undefined) payload.total_habitantes = Number(values.total_habitantes) || 0;
		await updatePais(item.id_pais, payload);
		await load();
	}

		async function handleDelete() {
			// countries deletion disabled by policy
			alert('No es posible eliminar países desde la interfaz');
		}

		async function handleCreate(payload) {
			await createPais(payload);
			await load();
			setOpenCreate(false);
		}

	const filtered = paises.filter(p => p.nombre_pais.toLowerCase().includes(query.toLowerCase()));

	return (
		<div>
			<h3>Países</h3>
					<div className={styles.toolbar}>
						<input className={styles.search} placeholder="Buscar..." value={query} onChange={(e)=>setQuery(e.target.value)} />
					</div>
			{loading ? <div>Cargando...</div> : (
						<div className={styles.gridWrapper}>
							<div className={styles.grid}>
								<div className={styles.plusCard} onClick={()=>setOpenCreate(true)}>+</div>
								{openCreate && (
									<div className={cardStyles.card}>
										<h4 style={{marginTop:0}}>Crear país</h4>
										<CreatePaisInline onCreate={handleCreate} onCancel={()=>setOpenCreate(false)} />
									</div>
								)}
								{filtered.map(p => (
							<AdminCard
								key={p.id_pais}
								item={p}
									fixedSize
								onUpdate={handleUpdate}
								onDelete={handleDelete}
								renderView={(it)=> (
										<div className={styles.paisView}>
											<strong className={styles.paisTitle}>{it.nombre_pais}</strong>
											<div className={styles.paisLine}>Código: {it.codigo || '-'}</div>
											<div className={styles.paisLine}>Habitantes: {it.total_habitantes || '-'}</div>
									</div>
								)}
								renderEdit={(values, setValues, { onCancel, onSave, saving }) => (
									<div>
										<div className="row"><label>Nombre</label><input value={values.nombre_pais} onChange={(e)=>setValues({...values, nombre_pais: e.target.value})} /></div>
										<div className="row"><label>Código</label><input value={values.codigo || ''} onChange={(e)=>setValues({...values, codigo: e.target.value})} /></div>
										<div className="row"><label>Total habitantes</label><input type="number" value={values.total_habitantes || ''} onChange={(e)=>setValues({...values, total_habitantes: e.target.value})} /></div>
										<div className="actions"><button disabled={saving} onClick={onSave}>Guardar</button><button onClick={onCancel}>Cancelar</button></div>
									</div>
								)}
							/>
						))}
					</div>
				</div>
			)}

						{/* inline create handled above next to + */}
		</div>
	);
}

function CreatePaisForm({ onCreate, onCancel }) {
	const [nombre, setNombre] = useState('');
	const [codigo, setCodigo] = useState('');
	const [habitantes, setHabitantes] = useState('');

	async function submit(e) {
		e.preventDefault();
		await onCreate({ nombre_pais: nombre, codigo: codigo || undefined, total_habitantes: habitantes ? Number(habitantes) : undefined });
	}

	return (
		<form onSubmit={submit}>
			<div><label>Nombre país</label><input value={nombre} onChange={(e)=>setNombre(e.target.value)} required /></div>
			<div><label>Código</label><input value={codigo} onChange={(e)=>setCodigo(e.target.value)} placeholder="p.ej. AR" /></div>
			<div><label>Total habitantes</label><input type="number" value={habitantes} onChange={(e)=>setHabitantes(e.target.value)} /></div>
			<div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
		</form>
	);
}

function CreatePaisInline({ onCreate, onCancel }) {
	const [nombre, setNombre] = useState('');
	const [codigo, setCodigo] = useState('');
	const [habitantes, setHabitantes] = useState('');
	async function submit(e) {
		e.preventDefault();
		await onCreate({ nombre_pais: nombre, codigo: codigo || undefined, total_habitantes: habitantes ? Number(habitantes) : undefined });
	}
	return (
		<form onSubmit={submit}>
			<div><label>Nombre país</label><input value={nombre} onChange={(e)=>setNombre(e.target.value)} required /></div>
			<div><label>Código</label><input value={codigo} onChange={(e)=>setCodigo(e.target.value)} placeholder="p.ej. AR" /></div>
			<div><label>Total habitantes</label><input type="number" value={habitantes} onChange={(e)=>setHabitantes(e.target.value)} /></div>
			<div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
		</form>
	);
}


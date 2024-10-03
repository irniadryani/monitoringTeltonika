import React, { useState } from 'react'
import {
	Card,
	Grid,
	styled,
	useTheme,
	Stack,
	Button,
	Modal,
	Box,
	Typography,
	TextField,
	Autocomplete,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	ButtonGroup,
	CircularProgress,
	Pagination,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import RestoreIcon from '@mui/icons-material/Restore'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'
import {
	kelolaClientFn,
	singleClientFn,
	insertClientFn,
	suspendFn,
	restoreFn,
} from '../../api/Kelola-Client/KelolaClient'
import {
	listKabupatenKotaFn,
	listProvinsiFn,
	listKecamatanFn,
} from '../../api/Lokasi/Lokasi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { formatISO } from 'date-fns'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function createData(no, nama, alamat, nohp, email, tgl, status) {
	return { no, nama, alamat, nohp, email, tgl, status }
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})

const Container = styled('div')(({ theme }) => ({
	margin: '30px',
}))

const H4 = styled('h4')(({ theme }) => ({
	fontSize: '1.2rem',
	fontWeight: '1000',
	marginBottom: '35px',
	textTransform: 'capitalize',
	color: theme.palette.text.secondary,
}))

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1000,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 3.5,
	maxHeight: '90vh',
	overflowY: 'auto',
	borderRadius: 2,
}

const style2 = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 3.5,
	maxHeight: '90vh',
	overflowY: 'auto',
	borderRadius: 2,
}

const data_provinsi = [
	{ id: 'jabar', label: 'Jawa Barat' },
	{ id: 'jateng', label: 'Jawa Tengah' },
	{ id: 'jatim', label: 'Jawa Timur' },
	{ id: 'suta', label: 'Sulawesi Utara' },
]

const data_kota = [
	{ id: 'kbb', label: 'Kabupaten Bandung Barat' },
	{ id: 'bandung', label: 'Kota Bandung' },
	{ id: 'cimahi', label: 'Kota Cimahi' },
]

const data_kec = [
	{ id: 'parongpong', label: 'Parongpong' },
	{ id: 'lembang', label: 'Lembang' },
	{ id: 'sukajadi', label: 'Sukajadi' },
]

export default function Kelola_Client() {
	const { palette } = useTheme()
	const [activeModal, setActiveModal] = useState(null)
	const [clientId, setClientId] = useState(null)
	// const handleOpen = (modalName) => {setActiveModal(modalName);};
	// const handleClose = () => {setActiveModal(null);};
	const [provinsi, setProvinsi] = useState('')
	const [kota, setKota] = useState('')
	const [date, setDate] = useState(new Date().toISOString().split('T')[0])
	const [kecamatan, setKecamatan] = useState('')
	const [inputValue, setinputvalue] = useState({ id: '', label: '' })
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [clients, setClients] = useState([])

	const navigate = useNavigate()

	const {
		data: dataClient,
		refetch: refetchClient,
		isLoading: loadingClient,
		reset: resetClient,
	} = useQuery({
		queryKey: 'allClient',
		queryFn: kelolaClientFn,
	})

	const {
		data: dataSingleClient,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['singleClient', clientId],
		queryFn: () => singleClientFn(clientId),
		enabled: !!clientId,
	})

	const handleOpen = (modalName, id) => {
		setClientId(id)
		setActiveModal(modalName)
	}

	const handleClose = () => {
		setActiveModal(null)
		setClientId(null)
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm({
		defaultValues: {
			tgl_bergabung: '',
		},
	})

	const handleInsertClient = useMutation({
		mutationFn: (data) => insertClientFn(data),
		onMutate() {},
		onSuccess: async (res) => {
			console.log(res)
			refetchClient()
			handleClose()
			reset()
			// document.getElementById("modal1").close();
		},
		onError: (error) => {
			console.log(error)
			// document.getElementById("modal1").close();
			const errorMessage =
				error.response?.data?.message || 'An error occurred'
		},
	})

	const addClient = async (data) => {
		data.tgl_bergabung = formatISO(new Date(date))
		data.status_akun = 'Aktif'
		handleInsertClient.mutateAsync(data)
	}

	const handleClick = () => {
		handleSubmit(addClient)()
	}

	const handleReset = () => {
		reset()
	}

	const {
		data: dataProvinsi,
		refetch: refetchProvinsi,
		isLoading: loadingProvinsi,
		reset: resetProvinsi,
	} = useQuery({
		queryKey: 'allProvinsi',
		queryFn: listProvinsiFn,
	})

	const {
		data: dataKecamatan,
		refetch: refetchKecamatan,
		isLoading: loadingKecamatan,
		reset: resetKecamatan,
	} = useQuery({
		queryKey: 'allKecamatan',
		queryFn: listKecamatanFn,
	})

	const {
		data: dataKabupatenKota,
		refetch: refetchKabupatenKota,
		isLoading: loadingKabupatenKota,
		reset: resetKabupatenKota,
	} = useQuery({
		queryKey: 'allKabupatenKota',
		queryFn: listKabupatenKotaFn,
	})

	const handleSuspendClient = async (id) => {
		try {
			const updatedClient = await suspendFn(id)
			handleClose()
			console.log('Client suspended:', updatedClient)
		} catch (error) {
			console.error('Failed to suspend client:', error)
		}
	}

	const handleRestoreClient = async (id) => {
		try {
			const updatedClient = await restoreFn(id)
			handleClose()
			console.log('Client restore:', updatedClient)
		} catch (error) {
			console.error('Failed to restore client:', error)
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		const day = String(date.getDate()).padStart(2, '0')
		const month = date.toLocaleString('id-ID', { month: 'long' })
		const year = date.getFullYear()

		return `${day} ${month} ${year}`
	}

	// useEffect(() => {
	//   if (dataClient?.clients) {
	//     setValue("nama_client", dataClient.nama_client);
	//     setValue("alamat_client", dataClient.alamat_client);
	//     setValue("provinsi", dataClient.provinsi);
	//     setValue("kabupaten_kota", dataClient.kabupaten_kota);
	//     setValue("kecamatan", dataClient.kecamatan);
	//     setValue("kode_pos", dataClient.kode_pos);
	//     setValue("no_hp", dataClient.no_hp);
	//     setValue("email", dataClient.email);
	//     setValue("status_akun", dataClient.status_akun);
	//     setValue("tgl_bergabung", dataClient.tgl_bergabung);
	//   }
	// }, [dataClient, setValue]);

	return (
		<Container>
			<H4
				sx={{
					fontFamily: 'Arial, sans-serif',
					fontWeight: 'bold',
					fontSize: '25px',
					textAlign: 'left',
				}}
			>
				Kelola Client
			</H4>

			<Stack spacing={2}>
				<form onSubmit={handleSubmit(addClient)}>
					<Stack
						direction='row'
						spacing={2}
						sx={{
							justifyContent: 'space-between',
							alignItems: 'baseline',
						}}
					>
						<Button
							variant='contained'
							color='success'
							onClick={() => handleOpen('modal1')}
						>
							Tambah Client
						</Button>
						<Modal
							open={activeModal === 'modal1'}
							onClose={handleClose}
							aria-labelledby='modal-modal-title'
							aria-describedby='modal-modal-description'
						>
							<Box sx={style}>
								<H4>Tambah Client</H4>
								<Stack spacing={2}>
									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Nama Klien
										</Typography>

										<TextField
											label='Nama Klien'
											variant='outlined'
											sx={{ width: 500 }}
											{...register('nama_client', {
												required: true,
											})}
											error={!!errors.nama_client}
											helperText={
												errors.nama_client
													? 'Nama Klien diperlukan'
													: ''
											}
										/>
									</Stack>
									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Alamat
										</Typography>

										<TextField
											label='Alamat'
											variant='outlined'
											sx={{ width: 500 }}
											{...register('alamat_client', {
												required: true,
											})}
											error={!!errors.nama_client}
											helperText={
												errors.nama_client
													? 'Nama Klien diperlukan'
													: ''
											}
										/>
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											component='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Provinsi
										</Typography>

										{loadingProvinsi ? (
											<CircularProgress />
										) : (
											<Autocomplete
												sx={{ width: 500 }}
												options={dataProvinsi}
												getOptionLabel={(option) =>
													option.provinsi
												}
												value={provinsi}
												onChange={(e, newValue) =>
													setProvinsi(newValue)
												}
												renderInput={(params) => (
													<TextField
														{...params}
														label='Provinsi'
														variant='outlined'
														error={!provinsi}
														helperText={
															!provinsi
																? 'Provinsi diperlukan'
																: ''
														}
														{...register(
															'provinsi',
															{ required: true }
														)}
													/>
												)}
											/>
										)}
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Kabupaten/Kota
										</Typography>

										{loadingKabupatenKota ? (
											<CircularProgress />
										) : (
											<Autocomplete
												sx={{ width: 500 }}
												options={dataKabupatenKota}
												getOptionLabel={(option) =>
													option.kabupaten_kota
												}
												value={kota}
												onChange={(e, newValue) =>
													setKota(newValue)
												}
												renderInput={(params) => (
													<TextField
														{...params}
														label='Kabupaten/Kota'
														variant='outlined'
														error={!kota}
														helperText={
															!kota
																? 'Kabupaten/Kota diperlukan'
																: ''
														}
														{...register(
															'kabupaten_kota',
															{ required: true }
														)}
													/>
												)}
											/>
										)}
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											component='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Kecamatan
										</Typography>

										{loadingKecamatan ? (
											<CircularProgress />
										) : (
											<Autocomplete
												sx={{ width: 500 }}
												options={dataKecamatan}
												getOptionLabel={(option) =>
													option.kecamatan
												}
												value={kecamatan}
												onChange={(e, newValue) => {
													setKecamatan(newValue)
													if (
														typeof newValue ===
														'string'
													) {
														setKecamatan({
															label: newValue,
														})
													}
												}}
												freeSolo
												renderInput={(params) => (
													<TextField
														{...params}
														label='Kecamatan'
														variant='outlined'
														error={!kecamatan}
														helperText={
															!kecamatan
																? 'Kecamatan diperlukan'
																: ''
														}
														{...register(
															'kecamatan',
															{ required: true }
														)}
													/>
												)}
											/>
										)}
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Kode Pos
										</Typography>

										<TextField
											label='Kode Pos'
											variant='outlined'
											sx={{ width: 500 }}
											{...register('kode_pos', {
												required: true,
											})}
											error={!!errors.kode_pos}
											helperText={
												errors.kode_pos
													? 'Kode Pos diperlukan'
													: ''
											}
										/>
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Nomor Kontak
										</Typography>

										<TextField
											label='Nomor Kontak'
											variant='outlined'
											sx={{ width: 500 }}
											{...register('no_hp', {
												required: true,
											})}
											error={!!errors.no_hp}
											helperText={
												errors.no_hp
													? 'Nomor Kontak diperlukan'
													: ''
											}
										/>
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											components='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Email
										</Typography>

										<TextField
											label='Email'
											variant='outlined'
											sx={{ width: 500 }}
											{...register('email', {
												required: true,
											})}
											error={!!errors.email}
											helperText={
												errors.email
													? 'Email diperlukan'
													: ''
											}
										/>
									</Stack>

									<Stack
										direction='row'
										spacing={2}
										alignItems='center'
									>
										<Typography
											id='modal-modal-title'
											variant='h6'
											component='h6'
											sx={{
												minWidth: '150px',
												fontSize: '1rem',
											}}
										>
											Tanggal Bergabung
										</Typography>

										<TextField
											label='Tanggal Bergabung'
											type='date'
											defaultValue={date}
											onChange={(e) =>
												setDate(e.target.value)
											}
											InputLabelProps={{
												shrink: true,
											}}
											sx={{ width: 500 }}
											{...register('tgl_bergabung', {
												required: true,
											})}
										/>
									</Stack>
								</Stack>
								<Stack
									direction='row'
									spacing={12}
									sx={{
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: 5,
									}}
								>
									<Button
										variant='contained'
										color='error'
										onClick={handleReset}
									>
										Reset
									</Button>
									<Button
										variant='contained'
										color='success'
										type='submit'
										typeof='submit'
										onClick={handleClick}
									>
										Simpan
									</Button>
								</Stack>
							</Box>
						</Modal>
					</Stack>
				</form>
				<Stack spacing={2}>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label='simple table'>
							<TableHead>
								<TableRow>
									<TableCell
										align='center'
										sx={{
											width: '40px',
											border: '1px solid #ddd',
										}}
									>
										No
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '135px',
											border: '1px solid #ddd',
										}}
									>
										Nama Klien
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '200px',
											border: '1px solid #ddd',
										}}
									>
										Alamat
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '110px',
											border: '1px solid #ddd',
										}}
									>
										Nomor Kontak
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '200px',
											border: '1px solid #ddd',
										}}
									>
										Email
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '100px',
											border: '1px solid #ddd',
										}}
									>
										Tgl Gabung
									</TableCell>
									<TableCell
										align='center'
										sx={{
											width: '75px',
											border: '1px solid #ddd',
										}}
									>
										Status
									</TableCell>
									<TableCell
										align='center'
										sx={{ border: '1px solid #ddd' }}
									>
										Aksi
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataClient?.clients.map((row, index) => (
									<TableRow key={row.no}>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{index + 1}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{row.nama_client}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{row.alamat_client}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{row.no_hp}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{row.email}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{formatDate(row.tgl_bergabung)}
										</TableCell>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ border: '1px solid #ddd' }}
										>
											{row.status_akun}
										</TableCell>
										<TableCell
											align='center'
											sx={{
												width: 'auto',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<ButtonGroup
												variant='text'
												aria-label='Basic button group'
												sx={{ width: '100%' }}
											>
												<Button
													color='info'
													sx={{ flex: 1 }}
													onClick={() =>
														handleOpen(
															'modal2',
															row.id_client
														)
													}
												>
													<VisibilityIcon />
												</Button>
												<Modal
													open={
														activeModal === 'modal2'
													}
													onClose={handleClose}
													aria-labelledby='modal-modal-title'
													aria-describedby='modal-modal-description'
												>
													<Box sx={style}>
														<H4>Data Client</H4>
														{dataSingleClient && (
															<Stack spacing={2}>
																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Nama
																		Klien
																	</Typography>
																	<TextField
																		label='Nama Klien'
																		variant='outlined'
																		value={
																			dataSingleClient.nama_client
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>
																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Alamat
																	</Typography>

																	<TextField
																		label='Alamat'
																		variant='outlined'
																		value={
																			dataSingleClient.alamat_client
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Provinsi
																	</Typography>

																	<TextField
																		label='Alamat'
																		variant='outlined'
																		value={
																			dataSingleClient.provinsi
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Kabupaten/Kota
																	</Typography>

																	<TextField
																		label='Alamat'
																		variant='outlined'
																		value={
																			dataSingleClient.kabupaten_kota
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Kecamatan
																	</Typography>

																	<TextField
																		label='Alamat'
																		variant='outlined'
																		value={
																			dataSingleClient.kecamatan
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Kode Pos
																	</Typography>

																	<TextField
																		label='Kode Pos'
																		variant='outlined'
																		sx={{
																			width: 500,
																		}}
																		value={
																			dataSingleClient.kode_pos
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Nomor
																		Kontak
																	</Typography>

																	<TextField
																		label='Nomor Kontak'
																		variant='outlined'
																		sx={{
																			width: 500,
																		}}
																		value={
																			dataSingleClient.no_hp
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Email
																	</Typography>

																	<TextField
																		label='Email'
																		variant='outlined'
																		sx={{
																			width: 500,
																		}}
																		value={
																			dataSingleClient.email
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																	/>
																</Stack>

																<Stack
																	direction='row'
																	spacing={2}
																	alignItems='center'
																>
																	<Typography
																		id='modal-modal-title'
																		variant='h6'
																		components='h6'
																		sx={{
																			minWidth:
																				'150px',
																			fontSize:
																				'1rem',
																		}}
																	>
																		Tanggal
																		Bergabung
																	</Typography>

																	<TextField
																		label='Tanggal Bergabung'
																		value={
																			dataSingleClient.tgl_bergabung
																		}
																		InputProps={{
																			readOnly: true,
																		}}
																		sx={{
																			width: 500,
																		}}
																	/>
																</Stack>
															</Stack>
														)}
													</Box>
												</Modal>
												<Button
													color='warning'
													sx={{ flex: 1 }}
													onClick={() =>
														handleOpen('modal3')
													}
												>
													<EditIcon />
												</Button>
												<Modal
													open={
														activeModal === 'modal3'
													}
													onClose={handleClose}
													aria-labelledby='modal-modal-title'
													aria-describedby='modal-modal-description'
												>
													<Box sx={style}>
														<H4>Edit Client</H4>
														<Stack spacing={2}>
															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Nama Klien
																</Typography>

																<TextField
																	label='Nama Klien'
																	variant='outlined'
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>
															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Alamat
																</Typography>

																<TextField
																	label='Alamat'
																	variant='outlined'
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Provinsi
																</Typography>

																<Autocomplete
																	sx={{
																		width: 500,
																	}}
																	options={
																		data_provinsi
																	}
																	getOptionLabel={(
																		option
																	) =>
																		option.label
																	}
																	value={
																		provinsi
																	}
																	onChange={(
																		e,
																		newValue
																	) =>
																		setProvinsi(
																			newValue
																		)
																	}
																	renderInput={(
																		params
																	) => (
																		<TextField
																			{...params}
																			label='Provinsi'
																			variant='outlined'
																		/>
																	)}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Kabupaten/Kota
																</Typography>

																<Autocomplete
																	sx={{
																		width: 500,
																	}}
																	options={
																		data_kota
																	}
																	getOptionLabel={(
																		option
																	) =>
																		option.label
																	}
																	value={kota}
																	onChange={(
																		e,
																		newValue
																	) =>
																		setKota(
																			newValue
																		)
																	}
																	renderInput={(
																		params
																	) => (
																		<TextField
																			{...params}
																			label='Kabupaten/Kota'
																			variant='outlined'
																		/>
																	)}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Kecamatan
																</Typography>

																<Autocomplete
																	sx={{
																		width: 500,
																	}}
																	options={
																		data_kec
																	}
																	getOptionLabel={(
																		option
																	) =>
																		option.label
																	}
																	value={
																		kecamatan
																	}
																	onChange={(
																		e,
																		newValue
																	) =>
																		setKecamatan(
																			newValue
																		)
																	}
																	renderInput={(
																		params
																	) => (
																		<TextField
																			{...params}
																			label='Kecamatan'
																			variant='outlined'
																		/>
																	)}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Kode Pos
																</Typography>

																<TextField
																	label='Kode Pos'
																	variant='outlined'
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Nomor Kontak
																</Typography>

																<TextField
																	label='Nomor Kontak'
																	variant='outlined'
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Email
																</Typography>

																<TextField
																	label='Email'
																	variant='outlined'
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>

															<Stack
																direction='row'
																spacing={2}
																alignItems='center'
															>
																<Typography
																	id='modal-modal-title'
																	variant='h6'
																	components='h6'
																	sx={{
																		minWidth:
																			'150px',
																		fontSize:
																			'1rem',
																	}}
																>
																	Tanggal
																	Bergabung
																</Typography>

																<TextField
																	label='Tanggal Bergabung'
																	type='date'
																	value={date}
																	onChange={(
																		e
																	) =>
																		setDate(
																			e
																				.target
																				.value
																		)
																	}
																	InputLabelProps={{
																		shrink: true,
																	}}
																	sx={{
																		width: 500,
																	}}
																/>
															</Stack>
														</Stack>
														<Stack
															direction='row'
															spacing={12}
															sx={{
																justifyContent:
																	'center',
																alignItems:
																	'center',
																marginTop: 5,
															}}
														>
															<Button
																variant='contained'
																color='error'
															>
																Reset
															</Button>
															<Button
																variant='contained'
																color='success'
															>
																Simpan
															</Button>
														</Stack>
													</Box>
												</Modal>
												<Button
													color='warning'
													sx={{ flex: 1 }}
													onClick={() =>
														handleOpen('modal4')
													}
												>
													<RestartAltIcon />
												</Button>
												<Modal
													open={
														activeModal === 'modal4'
													}
													onClose={handleClose}
													aria-labelledby='modal-modal-title'
													aria-describedby='modal-modal-description'
												>
													<Box sx={style2}>
														<H4
															sx={{
																fontFamily:
																	'Arial, sans-serif',
																fontWeight:
																	'bold',
																fontSize:
																	'20px',
																textAlign:
																	'center',
															}}
														>
															Apakah anda yakin
															untuk mereset
															password?
														</H4>
														<Stack
															direction='row'
															spacing={12}
															sx={{
																justifyContent:
																	'center',
																alignItems:
																	'center',
																marginTop: 5,
															}}
														>
															<Button
																variant='contained'
																color='error'
															>
																Tidak
															</Button>
															<Button
																variant='contained'
																color='success'
															>
																Ya
															</Button>
														</Stack>
													</Box>
												</Modal>
												<Button
													color='error'
													sx={{ flex: 1 }}
													onClick={() => {
														handleOpen(
															'modal5',
															row.id_client
														)
													}}
												>
													{row.status_akun ===
													'Suspend' ? (
														<>
															<RestoreIcon />
														</>
													) : (
														<>
															<DoNotDisturbOnIcon />
														</>
													)}
												</Button>
												<Modal
													open={
														activeModal === 'modal5'
													}
													onClose={handleClose}
													aria-labelledby='modal-modal-title'
													aria-describedby='modal-modal-description'
												>
													<Box sx={style2}>
														{dataSingleClient?.status_akun ===
														'Aktif' ? (
															<>
																<H4
																	sx={{
																		fontFamily:
																			'Arial, sans-serif',
																		fontWeight:
																			'bold',
																		fontSize:
																			'20px',
																		textAlign:
																			'center',
																	}}
																>
																	Apakah anda
																	yakin untuk
																	melakukan
																	suspend akun
																	klien ini?
																</H4>
																<Stack
																	direction='row'
																	spacing={12}
																	sx={{
																		justifyContent:
																			'center',
																		alignItems:
																			'center',
																		marginTop: 5,
																	}}
																>
																	<Button
																		variant='contained'
																		color='error'
																		onClick={
																			handleClose
																		}
																	>
																		Tidak
																	</Button>
																	<Button
																		variant='contained'
																		color='success'
																		onClick={() => {
																			handleSuspendClient(
																				dataSingleClient.id_client
																			)
																		}}
																	>
																		Ya
																	</Button>
																</Stack>
															</>
														) : (
															<>
																<H4
																	sx={{
																		fontFamily:
																			'Arial, sans-serif',
																		fontWeight:
																			'bold',
																		fontSize:
																			'20px',
																		textAlign:
																			'center',
																	}}
																>
																	Apakah anda
																	yakin untuk
																	mengaktifkan
																	kembali akun
																	klien ini?
																</H4>
																<Stack
																	direction='row'
																	spacing={12}
																	sx={{
																		justifyContent:
																			'center',
																		alignItems:
																			'center',
																		marginTop: 5,
																	}}
																>
																	<Button
																		variant='contained'
																		color='error'
																		onClick={
																			handleClose
																		}
																	>
																		Tidak
																	</Button>
																	<Button
																		variant='contained'
																		color='success'
																		onClick={() => {
																			handleRestoreClient(
																				dataSingleClient.id_client
																			)
																		}}
																	>
																		Ya
																	</Button>
																</Stack>
															</>
														)}
													</Box>
												</Modal>
											</ButtonGroup>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			</Stack>
			<Pagination count={dataClient?.totalPages} shape='rounded' />
		</Container>
	)
}

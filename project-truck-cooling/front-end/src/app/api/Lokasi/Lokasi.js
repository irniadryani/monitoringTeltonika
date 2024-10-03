import { Api } from '../../common/api'

export const listProvinsiFn = async () => {
	const response = await Api.get('/api/provinsi')
	return response.data
}

export const listKecamatanFn = async () => {
	const response = await Api.get('/api/kecamatan')
	return response.data
}

export const listKabupatenKotaFn = async () => {
	const response = await Api.get('/api/kabupaten-kota')
	return response.data
}
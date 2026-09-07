import * as API from './client/src/APIRequest/APIRequest.js'

async function run() {
  try {
    const brands = await API.ProductBrandList()
    console.log('BRANDS_OK', brands.status === 'success' ? brands.data.length : 'no')
  } catch (e) {
    console.error('TEST_ERR', e.message)
  }
}
run()
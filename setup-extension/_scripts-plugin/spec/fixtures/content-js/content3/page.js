import Page from '@pages//content3'
import {_generateMetadata} from 'app/_utils'

export const generateMetadata = async () =>
  await _generateMetadata(
    () => '',
    () => ''
  )

export default Page

import Page from '@pages//serviceworker.spec'
import {_generateMetadata} from 'app/_utils'

export const generateMetadata = async () =>
  await _generateMetadata(
    () => '',
    () => ''
  )

export default Page

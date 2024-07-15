import manifestOverries from '../../manifest-overrides'
import {dirname, getFixturesPath, win32} from '../__utils__'

describe('manifestOverries', () => {
  const manifestPath = getFixturesPath('super-manifest')
  const context = dirname(manifestPath)
  const exclude = win32()
    ? [
        `${context}\\icons\\icon16.png`,
        `${context}\\icons\\icon48.png`,
        `${context}\\icons\\icon128.png`
      ]
    : ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png']

  it('should transform manifest action details correctly', () => {
    const result = manifestOverries(manifestPath, undefined, exclude)

    expect(JSON.parse(result)).toEqual({
      action: {
        default_popup: 'action/default_popup.html',
        default_icon: 'action/icon.png'
      },
      background: {
        page: 'background.html',
        scripts: ['background.js', 'background2.js'],
        service_worker: 'background/service_worker.js'
      },
      browser_action: {
        default_icon: 'icons/icon16.png',
        default_popup: 'browser_action/default_popup.html',
        theme_icons: [
          {
            light: 'browser_action/icon16-light.png',
            dark: 'browser_action/icon16-dark.png',
            size: 16
          },
          {
            light: 'browser_action/icon16-light.png',
            dark: 'browser_action/icon16-dark.png',
            size: 16
          }
        ]
      },
      chrome_url_overrides: {
        bookmarks: 'chrome_url_overrides/bookmarks.html',
        history: 'chrome_url_overrides/history.html',
        newtab: 'chrome_url_overrides/newtab.html'
      },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content_scripts/content-0.js', 'content_scripts/content-0.js'],
          css: [
            'content_scripts/content-0.css',
            'content_scripts/content-0.css'
          ]
        },
        {
          matches: ['<all_urls>'],
          js: ['content_scripts/content-1.js', 'content_scripts/content-1.js'],
          css: [
            'content_scripts/content-1.css',
            'content_scripts/content-1.css'
          ]
        }
      ],
      declarative_net_request: {
        rule_resources: [
          {
            id: 'block_ads',
            enabled: true,
            path: 'declarative_net_request/block_ads.json'
          }
        ]
      },
      devtools_page: 'devtools_page.html',
      icons: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      },
      options_page: 'options_ui/page.html',
      options_ui: {
        page: 'options_ui/page.html'
      },
      page_action: {
        default_icon: 'icons/icon16.png',
        default_popup: 'page_action/default_popup.html'
      },
      sandbox: {
        pages: ['sandbox/page-0.html', 'sandbox/page-1.html']
      },
      sidebar_action: {
        default_panel: 'sidebar_action/default_panel.html',
        default_icon: 'icons/icon16.png'
      },
      storage: {
        managed_schema: 'storage/managed_schema.json'
      },
      theme: {
        images: {
          theme_frame: 'theme/images/theme_frame.png'
        }
      },
      user_scripts: {
        api_script: 'user_scripts/api_script.js'
      },
      web_accessible_resources: [
        'images/my-image.png',
        'script.js',
        'styles.css'
      ],
      side_panel: {
        default_path: 'side_panel/default_path.html'
      }
    })
  })
})

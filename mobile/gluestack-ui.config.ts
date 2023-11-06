// gluestack-ui.config.ts
import {
    config as defaultConfig,
    createConfig,
  } from '@gluestack-ui/themed';
  
  export const config = createConfig({
    ...defaultConfig.theme,
    components: {
      Button: {
        theme: {
          variants: {
            use: {
              login: {
                bg: '#9333ea',
               borderRadius:8,
               height:50,
              
              },
            },
          },
        },
      },
      Box:{
        theme:{
            variants: {
                use: {
                  background: {
                    bg: '#F3F3F3',
                  },
                },
              },
        }
      },
     
    },
  });
  
  // Get the type of Config
  type ConfigType = typeof config;
  
  // Extend the internal ui config
  declare module "@gluestack-ui/themed" {
    interface UIConfig extends ConfigType {}
  }
  
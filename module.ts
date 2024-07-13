#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')

// Get the command-line arguments passed to the script
const args = process.argv.slice(2)

if (args.length < 2) {
  console.error('Usage: extension-develop <command> <path> [flags...]')
  process.exit(1)
}

// The first argument is the command (dev, preview, build)
const command = args[0]

// The second argument is the path
const EXTENSION_PROJECT_PATH = args[1]

// The subsequent arguments are the flags
const EXTENSION_PROJECT_FLAGS = args.slice(2).join(' ')

// Create the .env file and write the environment variables to it
const envContent = `
EXTENSION_PROJECT_PATH=${EXTENSION_PROJECT_PATH}
EXTENSION_PROJECT_FLAGS=${EXTENSION_PROJECT_FLAGS}
`

fs.writeFileSync(path.resolve(__dirname, '.env'), envContent)

// Print the environment variables
console.log('EXTENSION_PROJECT_PATH:', EXTENSION_PROJECT_PATH)
console.log('EXTENSION_PROJECT_FLAGS:', EXTENSION_PROJECT_FLAGS)

// Map command to the appropriate rsbuild command
const rsbuildCommandMap: Record<string, string> = {
  dev: 'rsbuild dev',
  preview: 'rsbuild preview',
  build: 'rsbuild build'
}

const rsbuildCommand = rsbuildCommandMap[command]

if (!rsbuildCommand) {
  console.error(`Unknown command: ${command}`)
  process.exit(1)
}

// Function to process flags. These flags are passed directly
// to the rsbuild command and do not need the .env file to be set
const processFlags = (flags: string[]) => {
  const processedFlags = flags.map((flag) => {
    if (flag === '-w' || flag === '--watch') {
      return '--watch'
    } else if (flag.startsWith('--env-mode')) {
      return `--env-mode ${flag.split('=')[1]}`
    } else if (flag.startsWith('--env-dir')) {
      return `--env-dir ${flag.split('=')[1]}`
    } else if (flag.startsWith('--port')) {
      return `--port ${flag.split('=')[1]}`
    }
    return flag
  })
  return processedFlags.join(' ')
}

// Run the rsbuild command with the appropriate flags
const finalFlags = processFlags(args.slice(2))
const finalCommand = `${rsbuildCommand} ${finalFlags}`
console.log(`Executing: ${finalCommand}`)
execSync(finalCommand, {stdio: 'inherit'})

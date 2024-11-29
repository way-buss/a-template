if(!/pnpm/.test(process.env.npm_execpath || '')){
     console.warn(`错误`)
     process.exit(1)
}
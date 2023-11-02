#  ACEC PERU DASHBOARD 

 Proyecto de propuesta de mejora, SENATI 2023 - SEMESTRE VI
## 🪲 Requerimientos para instalación.
Debes tener estas herramientas de desarrollo antes de empezar con la instalación del proyecto.
- NodeJS  V18.18.0 o superior https://nodejs.org/en
- MySQL https://dev.mysql.com/downloads/mysql/

 ## ⭐ INSTALACIÓN DE ENTORNO 

Clona el repositorio en alguna parte de tu ordenador.
```bash
git clone https://github.com/Alfr3XD/acecperu-dashboard.git
```
Instalación de paquetes o dependencias.
Por defecto nodejs viene con npm, asi que puedes usar npm.
Puedes utilizar otro instalador de paquetes como *YARN* o *PNPM*

**NPM**
```bash
npm install
```

**YARN**
```bash
yarn install
```

**PNPM**
```bash
pnpm install
```

Luego de la instalación de las dependencias, ahora toca configurar las variables de entorno.
- Crea un archivo *.env* en la raíz del proyecto
- Copia el contenido del archivo env.example y cambia el contenido según tus requerimeintos.
	```json
	DATABASE_URL="mysql://user:password-@server:3306/database" #mysql string connection
	NEXTAUTH_SECRET=secretnextauth #Token Random
	NEXTAUTH_URL=http://localhost:3000 #URL 

	SECRET_KEY=keychangesecret #Token Random
	```
## 📊 BASE DE DATOS
Para la base de datos utilizamos prisma, para este caso vamos a generar la importación de modelos a nuestra base de datos que hemos creado en */prisma/schema.prisma* y luego lo migraremos a nuestra base de datos MySQL.
Ejecuta:
```bash
yarn run prisma:generate
```
```bash
yarn run prisma:migrate:dev
```
Si todo fue ejecutado correctamente, debío crearte un usuario por defecto del modelo usuario.
usuario: root
contraseña: 123
Si quieres cambiar la contraseña antes de migrar, puedes cambiar la contraseña desde "/prisma/seet.ts"
  
  ## 🪲 EJECUCIÓN

##  Learn More
Si completaste los pasos correctamente ahora puedes empezar con ejecutar el modo desarrollo.
```bash
yarn run dev
```
Debería salir esto
```bash
$ next dev
  ▲ Next.js 13.5.3
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 4.5s
```

Ahora solo entra a "https://localhost:3000"
Debería salir esto, ahora solo toca poner las credenciales del usuario creado por defecto.

![enter image description here](https://media.discordapp.net/attachments/950886048198705222/1169662136591593493/image.png?ex=655637c0&is=6543c2c0&hm=2ba1745acfe5c75ee6ad115f08c5de0cfbc8347dd45df6e32f8ae1b3fac45b82&=&width=1316&height=671)
  

##  Deploy on Vercel

  

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

  

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
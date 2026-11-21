# Plataforma de Eventos – Pre‑Entrega 4
 
### Descripción
 
Implementación de autenticación centralizada mediante Passport.js para la Plataforma de Eventos e Inscripciones.
 
Se mantiene el uso de JWT y cookies HTTP Only, incorporando estrategias Passport para registro, login y usuario actual. El contrato externo de la API no cambia respecto de la pre-entrega anterior, pero la lógica de autenticación queda centralizada y preparada para futuras estrategias externas.
 
### Tecnologías utilizadas
 
* Node.js
* Express
* ESM (import/export)
* dotenv
* Mongoose
* bcrypt
* jsonwebtoken
* cookie-parser
* passport
* passport-local
* passport-jwt
 
---
 
# Estructura del proyecto
 
```
src/
  app.js
  server.js
  config/
    db.js
    config.js
    passport.config.js
  routes/
    events.router.js
    sessions.router.js
  controllers/
    events.controller.js
    sessions.controller.js
  services/
    Sessions.service.js
  repositories/
    users.repository.js
  dao/
    users.dao.js
  models/
    User.js
    Event.js
    Session.js
  utils/
    hash.js
    jwt.js
.env.example
.gitignore
package.json
README.md
```
 
---
 
# Instalación
 
```bash
npm install
```
 
---
 
# Variables de entorno
 
Crear un archivo .env basado en .env.example.
 
Variables necesarias:
 
* PORT
* NODE_ENV
* MONGO_URL
* JWT_SECRET
* JWT_EXPIRES_IN
 
Ejemplo:
 
```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
JWT_SECRET=supersecreto
JWT_EXPIRES_IN=1h
```
 
---
 
# Cómo ejecutar el proyecto
 
```bash
npm start
```
 
El servidor se inicia en el puerto definido en .env.
 
---
 
# Estrategias Passport implementadas
 
### register
 
Responsable de:
 
* Validar el registro de usuarios
* Normalizar el email
* Verificar duplicados
* Hashear la contraseña con bcrypt
* Crear el usuario
* Dejar el resultado disponible en req.user
 
---
 
### login
 
Responsable de:
 
* Buscar el usuario por email
* Verificar credenciales
* Validar contraseña mediante bcrypt
* Dejar el usuario autenticado disponible en req.user
 
El JWT y la cookie currentUser son generados por el controller.
 
---
 
### current
 
Responsable de:
 
* Leer el JWT desde la cookie currentUser
* Validar el token
* Exponer el usuario autenticado en req.user
 
---
 
### Preparación para futuros providers
 
La configuración de Passport se encuentra centralizada en:
 
```text
src/config/passport.config.js
```
 
La arquitectura queda preparada para incorporar futuras estrategias de autenticación externas como Google OAuth o GitHub OAuth sin necesidad de modificar app.js.
 
---
 
# Rutas disponibles
 
### GET /api/health
 
```json
{
"status": "ok",
"message": "Servidor activo"
}
```
 
### GET /api/events
 
```json
{
"status": "success",
"payload": []
}
```
 
### GET /api/sessions
 
Esta ruta existe pero no está implementada en esta pre‑entrega.
 
Devuelve un error controlado indicando que el repositorio no está disponible.
 
---
 
# POST /api/sessions/register
 
### Descripción
 
Registra un usuario nuevo en la plataforma.
 
La autenticación está centralizada mediante la estrategia Passport register.
 
Incluye:
 
* Validación de campos obligatorios
* Validación de formato de email
* Normalización del email
* Verificación de email duplicado
* Hash seguro de contraseña con bcrypt
* Persistencia en MongoDB
* Respuesta sin incluir la contraseña
 
---
 
### Body esperado (JSON)
 
```json
{
"first_name": "Ana",
"last_name": "Pérez",
"email": "Ana@Mail.com ",
"password": "Secreta123"
}
```
 
### Respuesta exitosa (201)
 
```json
{
"status": "success",
"payload": {
"id": "665f2a...",
"first_name": "Ana",
"last_name": "Pérez",
"email": "ana@mail.com",
"role": "user"
}
}
```
 
### Email ya registrado (409)
 
```json
{
"status": "error",
"message": "El email ya está registrado"
}
```
 
---
 
# POST /api/sessions/login
 
### Descripción
 
Autentica un usuario registrado.
 
La validación de credenciales se realiza mediante la estrategia Passport login.
 
Incluye:
 
* Verificación de credenciales
* Validación de contraseña mediante bcrypt
* Generación de JWT
* Almacenamiento del token en cookie HTTP Only
* Mensaje genérico ante credenciales inválidas
 
---
 
### Body esperado (JSON)
 
```json
{
"email": "ana@mail.com",
"password": "Secreta123"
}
```
 
### Respuesta exitosa (200)
 
```json
{
"status": "success",
"message": "Login correcto"
}
```
 
Además se genera una cookie HTTP Only llamada:
 
```text
currentUser
```
 
### Credenciales inválidas (401)
 
```json
{
"status": "error",
"message": "Credenciales inválidas"
}
```
 
---
 
# GET /api/sessions/current
 
### Descripción
 
Obtiene la información del usuario autenticado a partir del JWT almacenado en la cookie.
 
La autenticación se realiza mediante la estrategia Passport current.
 
### Respuesta exitosa (200)
 
```json
{
"status": "success",
"payload": {
"id": "665f2a...",
"email": "ana@mail.com",
"role": "user"
}
}
```
 
### Usuario no autenticado (401)
 
```json
{
"status": "error",
"message": "Unauthorized"
}
```
 
---
 
# POST /api/sessions/logout
 
### Descripción
 
Cierra la sesión eliminando la cookie de autenticación.
 
### Respuesta exitosa (200)
 
```json
{
"status": "success",
"message": "Sesión cerrada"
}
```
 
---
 
# Casos probados
 
* Registro exitoso
* Registro con email duplicado
* Login correcto
* Login con credenciales inválidas
* Consulta de usuario autenticado mediante /current
* Logout
* Acceso a /current luego de logout devolviendo 401
 
---
 
# Consideraciones de seguridad
 
* Las contraseñas se almacenan hasheadas mediante bcrypt.
* Passport.js centraliza la autenticación.
* El JWT se firma utilizando JWT_SECRET definido en variables de entorno.
* La cookie currentUser se configura como HTTP Only.
* Nunca se devuelve la contraseña en las respuestas de la API.
* No se incluyen credenciales ni archivos .env en el repositorio.
* El sistema queda preparado para futuras estrategias de autenticación externas.
 
---
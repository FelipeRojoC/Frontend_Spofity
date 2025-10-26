# 🎵 Spofity - Frontend

Este es el frontend de un **Clon de Spotify** desarrollado como parte del curso "Desarrollo de soluciones móviles". El objetivo es construir una app móvil moderna y funcional, aplicando buenas prácticas de producto y desarrollo.

El nombre oficial de nuestro proyecto es: **Spofity**

---

## 🧑‍💻 Autores

Este proyecto está siendo desarrollado en pareja por:

* **Felipe Rojo**
* **Bruce Munizaga**

---

## 📱 Acerca del Proyecto

Este repositorio contiene **exclusivamente el código del Frontend** (la aplicación móvil).

La aplicación permite a los usuarios registrarse, buscar y reproducir música, gestionar su biblioteca (likes y playlists) y explorar podcasts.

### 🔌 Nota sobre el Backend

El **Backend** (servidor, API REST y base de datos) se encuentra en un repositorio separado. Para que esta aplicación móvil funcione correctamente, el servidor backend debe estar ejecutándose localmente, ya que provee todos los datos del catálogo, la autenticación de usuarios y la gestión de playlists.

[**Link del repositorio Backend**](https://github.com/BruceMunizaga/Spofity-BACKEND)

---

## 🛠️ Stack Tecnológico

Tecnologías principales utilizadas para este proyecto frontend:

* **Framework Principal:** React Native (con Expo)
* **Lenguaje:** JavaScript (ES6+)
* **Navegación:** React Navigation
* **Editor de Código:** Visual Studio Code
* **Entorno de Pruebas:** Android Studio (para el Emulador de Android)
* **Entorno de Ejecución:** Node.js

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado el siguiente software:

1.  [**Node.js**](https://nodejs.org/): (Se recomienda la versión LTS)
2.  [**Visual Studio Code**](https://code.visualstudio.com/): (Editor de código principal)
3.  [**Android Studio**](https://developer.android.com/studio): (Necesario para configurar y ejecutar el Emulador de Android)

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clona este repositorio:**
    ```bash
    git clone [https://github.com/FelipeRojoC/Frontend_Spofity](https://github.com/FelipeRojoC/Frontend_Spofity)
    cd Frontend_Spofity
    ```

2.  **Instala las dependencias:**
    Abre el proyecto en VS Code y ejecuta el siguiente comando en la terminal:
    ```bash
    npm install
    ```
    *(Esto leerá el archivo `package.json` e instalará React Native, Expo y todas las librerías necesarias).*

3.  **Inicia tu Emulador de Android:**
    * Abre **Android Studio**.
    * Ve a `More Actions` > `Virtual Device Manager (AVD Manager)`.
    * Inicia el emulador que hayas configurado (ej. Pixel 6). Espera a que el teléfono virtual se encienda por completo.

4.  **Ejecuta el proyecto (Frontend):**
    * Asegúrate de tener el emulador del paso 3 corriendo.
    * Vuelve a la terminal de **VS Code** (dentro de la carpeta `Frontend_Spofity`).
    * Ejecuta uno de los siguientes comandos:

    Para iniciar en el emulador de Android:
    ```bash
    npm run android
    ```

    Para iniciar en un simulador de iOS (requiere macOS):
    ```bash
    npm run ios
    ```

    Para iniciar en el navegador web:
    ```bash
    npm run web
    ```

¡Y listo! 🎉 La aplicación se compilará y se abrirá automáticamente en la plataforma que elegiste.
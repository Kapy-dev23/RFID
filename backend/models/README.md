# Hospital RFID Access System

## Data Models

O sistema utiliza os seguintes modelos de dados para gerir utilizadores, portas, salas e registos de acesso.

---

## 1. User

Representa um utilizador do sistema hospitalar.

### Campos

| Campo       | Descrição                                                             |
| ----------- | --------------------------------------------------------------------- |
| `firstName` | Primeiro nome                                                         |
| `lastName`  | Último nome                                                           |
| `email`     | Email do utilizador                                                   |
| `password`  | Palavra-passe encriptada                                              |
| `rfid`      | Código único da pulseira RFID                                         |
| `role`      | Tipo de utilizador (`admin`, `doctor`, `nurse`, `patient`, `visitor`) |
| `active`    | Estado da conta                                                       |

---

## 2. Door

Representa uma porta do hospital.

### Campos

| Campo      | Descrição                                |
| ---------- | ---------------------------------------- |
| `doorName` | Nome da porta                            |
| `location` | Localização da porta                     |
| `state`    | Estado da porta (`active` ou `inactive`) |
| `readerId` | Leitor Rfid                              |

---

## 3. AccessLog

Regista todas as entradas e saídas efetuadas através do sistema RFID.

### Campos

| Campo        | Descrição                           |
| ------------ | ----------------------------------- |
| `user`       | Utilizador associado ao acesso      |
| `door`       | Porta utilizada                     |
| `date`       | Data e hora do acesso               |
| `type`       | Tipo de acesso (`enter` ou `leave`) |
| `authorised` | Indica se o acesso foi autorizado   |

---

## 4. Room

Representa uma sala do hospital.

### Campos

| Campo      | Descrição                 |
| ---------- | ------------------------- |
| `name`     | Nome da sala              |
| `building` | Edifício onde se encontra |
| `capacity` | Capacidade máxima da sala |

---

## Relação entre os modelos

```text
User
  │
  ├── possui ─────► RFID
  │
  └── realiza ────► AccessLog ◄──── Door
                          │
                          ▼
                        Room
```

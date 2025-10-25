# Jira IA

Projeto de automação que utiliza um agente de IA para analisar documentos de requisitos e criar automaticamente Épicos, Histórias de Usuário e Tarefas no Jira.

## 1. O Problema

O processo atual de planejamento de projetos e criação de roadmaps no Jira é manual, demorado e sujeito a inconsistências. Existe um gargalo significativo na transformação de documentos de requisitos de alto nível (como PDFs e DOCX) em um backlog acionável (Histórias de Usuário e Tarefas), o que diminui a eficiência da equipe de desenvolvimento.

## 2. A Solução Proposta

Esta aplicação atua como um "assistente de Product Owner", automatizando a criação do backlog inicial. A solução permite que os usuários façam o upload de documentos de requisitos, que são então processados por um agente de IA para sugerir um backlog estruturado. O usuário pode revisar, editar e aprovar essas sugestões antes de enviá-las para um projeto Jira específico com um único clique.

### Métricas de Sucesso (KPIs)

O objetivo é:
* **Reduzir em 50%** o tempo gasto para criar o backlog inicial de um novo projeto.
* **Aumentar em 30%** a velocidade com que novas features são cadastradas no Jira.
* **Manter uma taxa de aceitação de 80%** das sugestões geradas pela IA pelos Product Owners.

## 3. Features Principais

* **Upload de Documentos:** Suporte para arquivos `.pdf`, `.docx` e `.txt`.
* **Análise com IA:**
    * **Geração de Histórias:** A IA processa o documento e gera Histórias de Usuário no formato "Como um [ator], eu quero [ação], para que [benefício]".
    * **Quebra de Tarefas:** Para cada história, a IA sugere tarefas técnicas menores (ex: "Criar endpoint", "Desenvolver componente de UI").
* **Interface de Revisão (Staging):** Uma tela onde o usuário pode validar, editar, adicionar ou excluir as sugestões da IA antes de confirmar.
* **Integração com Jira:**
    * Autenticação segura com a API do Jira Cloud.
    * Listagem de projetos Jira disponíveis para o usuário.
    * Criação automática de Épicos, Histórias e Tarefas no projeto selecionado.
* **Segurança:** Autenticação de usuários na plataforma via JSON Web Tokens (JWT).

## 4. Arquitetura e Stack Tecnológica

O projeto segue uma arquitetura em 3 camadas com comunicação via API RESTful.

| Camada | Tecnologia | Responsabilidade |
| :--- | :--- | :--- |
| **Frontend** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) | Interface de usuário, upload de arquivos, tela de revisão e gestão de estado. |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white) | API RESTful, lógica de negócios, segurança (JWT) e orquestração das integrações. |
| **Banco de Dados** | ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white) | Persistência de dados (usuários, documentos, sugestões da IA). |
| **Integrações** | ![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white) | APIs externas para criação de tarefas (Jira) e análise de texto (LLM). |

## Contato

- Ana Sofia - [@Sun-cs-Sol](https://github.com/Sun-cs-Sol) - [Linkedin](https://www.linkedin.com/in/ana-sofia-moura-27b003248/)
- Camila Maria - [@camilamta275](https://github.com/camilamta275) - [Linkedin](https://www.linkedin.com/in/camilamta275/)
- Lucas Rodrigues - [@lucxsz-web](https://github.com/lucxsz-web) - [Linkedin](https://www.linkedin.com/in/lucas-rodrigues-08261b2ba/)
- René Melo - [@renysoo](https://github.com/renysoo) - [Linkedin](https://www.linkedin.com/in/renelucena/)
- Victor Ferreira - [@vic-fmr](https://github.com/vic-fmr) - [Linkedin](https://www.linkedin.com/in/victor-ferreira-marques/)
- Pamela Rodrigues - [@draedpunk](https://github.com/draedpunk) - [Linkedin](https://www.linkedin.com/in/rodrigues-pamela/)

# Integração de Agentes de IA com o Jira para Planejamento e Gestão de Tarefas

## Sobre o Projeto

Este projeto, parte de um desafio em colaboração com o Porto Digital e a Stefanini, tem como objetivo desenvolver uma solução que integra agentes de Inteligência Artificial com o Jira. A finalidade é automatizar e otimizar o processo de planejamento de software, desde a criação de histórias de usuário até a estruturação do backlog no Jira.

A aplicação permitirá o upload de documentos de requisitos, que serão analisados por um agente de IA para extrair informações, sugerir histórias de usuário e quebrar essas histórias em tarefas menores e gerenciáveis. Com isso, busca-se aumentar a eficiência da equipe, reduzir o tempo gasto em planejamentos e melhorar a qualidade das tarefas criadas.

## Funcionalidades

- **Análise de Requisitos:** Um agente de IA analisa os requisitos do projeto e as histórias de usuário.
- **Criação Automatizada de Histórias de Usuário:** Desenvolve histórias de usuário de forma automatizada para capturar os requisitos do projeto.
- **Quebra de Tarefas:** O agente de IA sugere a divisão de histórias de usuário em tarefas menores e mais gerenciáveis.
- **Geração de Sugestões:** O agente gera sugestões para um backlog organizado, considerando fatores como complexidade, dependências e prioridades.
- **Integração com a API do Jira:** A solução se conecta à API do Jira para criar e modificar tarefas existentes.
- **Interface para Upload:** Uma interface em Angular permite o upload de documentos e a visualização das sugestões do agente antes do envio para o Jira.
- **Edição de Tarefas:** Os usuários podem editar e ajustar as tarefas propostas pelo agente de IA.

## Stack Tecnológica

A solução foi construída utilizando as seguintes tecnologias:

- **Backend:** Java com Spring Boot
- **Frontend:** Angular
- **Banco de Dados:** MariaDB
- **Integrações:**
  - Jira Cloud REST API
  - LLMs (ex: OpenAI API, LangChain, Hugging Face)

## Arquitetura

O projeto segue uma arquitetura em camadas, com o frontend em Angular se comunicando com o backend via requisições HTTP. O backend em Spring Boot gerencia a lógica de negócios, a interação com os agentes de IA e a comunicação com o banco de dados MariaDB. A segurança é reforçada com autenticação baseada em JWT (JSON Web Tokens).

### Fluxo de Dados
1.  O usuário faz o upload de um documento através da interface em Angular.
2.  O frontend envia uma requisição HTTP para a API de backend.
3.  O backend processa a requisição, interage com os agentes de IA e o banco de dados MariaDB, retornando os resultados para o frontend.
4.  O frontend exibe os resultados, permitindo que o usuário interaja com as informações.


## Contato

- Ana Sofia - [@Sun-cs-Sol](https://github.com/Sun-cs-Sol) - [Linkedin](https://www.linkedin.com/in/ana-sofia-moura-27b003248/)
- Camila Maria - [@camilamta275](https://github.com/camilamta275) - [Linkedin](https://www.linkedin.com/in/camilamta275/)
- Lucas Rodrigues - [@lucxsz-web](https://github.com/lucxsz-web) - [Linkedin](https://www.linkedin.com/in/lucas-rodrigues-08261b2ba/)
- René Melo - [@renysoo](https://github.com/renysoo) - [Linkedin](https://www.linkedin.com/in/renelucena/)
- Victor Ferreira - [@vic-fmr](https://github.com/vic-fmr) - [Linkedin](https://www.linkedin.com/in/victor-ferreira-marques/)
- Pamela Rodrigues - [@](https://github.com/) - [Linkedin](https://www.linkedin.com/in/rodrigues-pamela/)

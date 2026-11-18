/* ==========================================================
   DOCE & SABOR - ASSISTENTE VIRTUAL (CHATBOT)
   Carrega perguntas frequentes via JSON e integra com WhatsApp
   ========================================================== */

(function () {
    const BASE_DADOS_CONTINGENCIA = {
        configuracao: {
            empresa: "Doce & Sabor Confeitaria Artesanal",
            subtitulo: "Assistente virtual",
            confeiteira: "Yara Ribeiro",
            whatsapp_numero: "5519983850132",
            whatsapp_exibicao: "(19) 98385-0132",
            instagram: "@doceysaborconfeitaria",
            cidades_atendidas: ["Campinas", "Valinhos", "Vinhedo", "Paulínia"],
            mensagem_boas_vindas: "Olá! 👋 Sou o assistente da Doce & Sabor. Como posso ajudar você hoje?"
        },
        faq: [
            {
                id: "encomendas",
                titulo: "🎂 Como fazer uma encomenda",
                exibir_no_menu: true,
                palavras_chave: ["encomenda", "encomendar", "pedido", "pedir", "orcamento", "comprar", "como funciona", "processo"],
                resposta: "É simples: 1. Escolha a linha ou envie a ideia do seu tema. 2. Peça o orçamento pelo formulário ou WhatsApp, informando quantidades e data. 3. Produzimos tudo fresquinho no ateliê. 4. Você recebe no local do evento ou retira no ateliê.",
                link_whatsapp: "Olá! Gostaria de solicitar um orçamento."
            },
            {
                id: "especialidades",
                titulo: "🍰 Nossas especialidades",
                exibir_no_menu: true,
                palavras_chave: ["especialidade", "especialidades", "produtos", "cardapio", "linhas", "doces", "vendem", "trabalham", "opcoes"],
                resposta: "Temos três linhas: 👰 Doces Finos & Casamentos (eventos de alto padrão), 🎁 Doces Personalizados (modelados para festas) e 🍫 Sobremesas & Pronta Entrega (brownies, copinhos de ganache e tortas)."
            },
            {
                id: "casamentos",
                titulo: "👰 Casamentos e doces finos",
                exibir_no_menu: false,
                palavras_chave: ["casamento", "casamentos", "noiva", "fino", "finos", "15 anos", "debutante", "corporativo", "evento", "cerimonial"],
                resposta: "Nossa linha de Doces Finos & Casamentos atende casamentos, festas de 15 anos e eventos corporativos de alto padrão, com acabamento refinado e ouro comestível.",
                link_whatsapp: "Gostaria de saber mais sobre Doces Finos para casamento."
            },
            {
                id: "horarios",
                titulo: "🕒 Horário de atendimento",
                exibir_no_menu: true,
                palavras_chave: ["horario", "horarios", "hora", "horas", "funciona", "funcionamento", "aberto", "abre", "fecha", "domingo", "sabado"],
                resposta: "Atendemos de Terça a Sábado, das 09h às 18h, e aos Domingos, das 09h às 12h."
            },
            {
                id: "entrega",
                titulo: "🚚 Entrega e região atendida",
                exibir_no_menu: true,
                palavras_chave: ["entrega", "entregam", "entregar", "frete", "regiao", "atendem", "cidade", "cidades", "valinhos", "vinhedo", "paulinia", "campinas", "retirada", "retirar"],
                resposta: "Atendemos sob encomenda em Campinas, Valinhos, Vinhedo, Paulínia e toda a Região Metropolitana. As entregas são refrigeradas. Você também pode retirar no ateliê."
            },
            {
                id: "endereco",
                titulo: "📍 Endereço e degustação",
                exibir_no_menu: false,
                palavras_chave: ["endereco", "onde", "fica", "localizacao", "atelie", "degustacao", "degustar", "visitar", "provar", "mapa"],
                resposta: "Nosso ateliê fica em Campinas - SP. A degustação e o atendimento presencial são feitos mediante agendamento prévio.",
                link_whatsapp: "Olá! Gostaria de agendar uma degustação e saber o endereço do ateliê."
            },
            {
                id: "precos",
                titulo: "💳 Preços e pagamento",
                exibir_no_menu: true,
                palavras_chave: ["preco", "precos", "valor", "valores", "quanto", "custa", "pagamento", "pagar", "pix", "cartao", "boleto", "parcelar", "sinal"],
                resposta: "Como cada projeto é feito sob medida, os valores variam conforme quantidade, tema e data. Fazemos o orçamento sem compromisso.",
                link_whatsapp: "Olá! Gostaria de saber valores e formas de pagamento."
            },
            {
                id: "calculo_quantidade",
                titulo: "🧁 Quantos doces pedir por convidado",
                exibir_no_menu: true,
                palavras_chave: ["quantos", "convidado", "convidados", "pessoas", "calcular", "cento", "quantidade por pessoa"],
                resposta: "A quantidade ideal depende do tipo de evento, horário e se haverá bolo. Passe o número de convidados no WhatsApp que ajudamos a calcular!",
                link_whatsapp: "Olá! Gostaria de ajuda para calcular a quantidade de doces para o meu evento."
            },
            {
                id: "restricoes",
                titulo: "🌱 Restrições alimentares",
                exibir_no_menu: false,
                palavras_chave: ["gluten", "lactose", "vegano", "vegana", "alergia", "alergico", "alergica", "restricao", "restricoes", "diet", "zero acucar"],
                resposta: "Se você tem restrição alimentar ou alergia, avise antes de fechar o pedido para confirmarmos a possibilidade de atendimento.",
                link_whatsapp: "Olá! Gostaria de saber sobre opções para restrição alimentar ou alergia."
            },
            {
                id: "atendente",
                titulo: "📞 Falar com atendente",
                exibir_no_menu: true,
                palavras_chave: ["contato", "atendente", "whatsapp", "zap", "telefone", "falar", "ligar", "humano", "instagram"],
                resposta: "Fale com a gente diretamente no WhatsApp (19) 98385-0132 ou pelo Instagram @doceysaborconfeitaria",
                link_whatsapp: "Olá! Vim pelo site e gostaria de falar com um atendente."
            }
        ]
    };

    function normalizarTexto(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function injetarEstilos() {
        if (document.getElementById("chatbot-styles")) return;

        const style = document.createElement("style");
        style.id = "chatbot-styles";
        style.textContent = `
            #chat-botao {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #3D231D;
                color: #FDF8F2;
                border: 2px solid #D4AF37;
                font-size: 1.6rem;
                cursor: pointer;
                box-shadow: 0 10px 28px rgba(61, 35, 29, 0.35);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.25s ease, background-color 0.25s ease;
            }

            #chat-botao:hover {
                background-color: #C87D70;
                transform: translateY(-3px) scale(1.04);
            }

            #chat-janela {
                position: fixed;
                bottom: 96px;
                right: 24px;
                width: 370px;
                max-width: calc(100vw - 32px);
                height: 510px;
                max-height: calc(100vh - 120px);
                background-color: #FFFFFF;
                border: 1px solid #EFE4D8;
                border-radius: 18px;
                box-shadow: 0 20px 50px rgba(61, 35, 29, 0.25);
                z-index: 9999;
                display: none;
                flex-direction: column;
                overflow: hidden;
                font-family: 'Montserrat', sans-serif;
            }

            #chat-janela.chat-aberto {
                display: flex;
                animation: chatSurgir 0.25s ease-out;
            }

            @keyframes chatSurgir {
                from { opacity: 0; transform: translateY(12px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            #chat-cabecalho {
                background-color: #3D231D;
                color: #FDF8F2;
                padding: 14px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid #D4AF37;
            }

            .chat-titulo-grupo {
                display: flex;
                flex-direction: column;
            }

            .chat-titulo {
                font-family: 'Playfair Display', serif;
                font-size: 1.05rem;
                font-weight: 700;
                color: #FDF8F2;
            }

            .chat-subtitulo {
                font-size: 0.72rem;
                color: #D4AF37;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .chat-acoes-topo {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .chat-btn-topo {
                background: rgba(255, 255, 255, 0.12);
                border: none;
                color: #FDF8F2;
                border-radius: 8px;
                padding: 5px 9px;
                font-size: 0.78rem;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .chat-btn-topo:hover {
                background: #C87D70;
            }

            #chat-mensagens {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background-color: #FDF8F2;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .chat-msg {
                max-width: 86%;
                padding: 11px 14px;
                border-radius: 14px;
                font-size: 0.84rem;
                line-height: 1.5;
                word-wrap: break-word;
            }

            .chat-msg-bot {
                align-self: flex-start;
                background-color: #FFFFFF;
                color: #4A3B37;
                border: 1px solid #EFE4D8;
                border-bottom-left-radius: 4px;
                box-shadow: 0 3px 10px rgba(61, 35, 29, 0.04);
            }

            .chat-msg-user {
                align-self: flex-end;
                background-color: #C87D70;
                color: #FFFFFF;
                border-bottom-right-radius: 4px;
                font-weight: 500;
            }

            .chat-btn-whats {
                display: inline-block;
                margin-top: 10px;
                padding: 8px 14px;
                background-color: #25D366;
                color: #FFFFFF;
                font-size: 0.78rem;
                font-weight: 700;
                border-radius: 50px;
                text-decoration: none;
                transition: filter 0.2s ease;
            }

            .chat-btn-whats:hover {
                filter: brightness(0.92);
            }

            #chat-opcoes {
                padding: 10px 12px;
                background-color: #FFFFFF;
                border-top: 1px solid #EFE4D8;
                display: flex;
                gap: 6px;
                overflow-x: auto;
                white-space: nowrap;
            }

            #chat-opcoes::-webkit-scrollbar {
                height: 5px;
            }

            #chat-opcoes::-webkit-scrollbar-thumb {
                background: #EFE4D8;
                border-radius: 10px;
            }

            .chat-opcao-btn {
                background-color: #FDF8F2;
                color: #3D231D;
                border: 1px solid #C87D70;
                border-radius: 50px;
                padding: 6px 12px;
                font-size: 0.75rem;
                font-weight: 600;
                font-family: 'Montserrat', sans-serif;
                cursor: pointer;
                flex-shrink: 0;
                transition: all 0.2s ease;
            }

            .chat-opcao-btn:hover {
                background-color: #C87D70;
                color: #FFFFFF;
            }

            #chat-form {
                display: flex;
                padding: 10px 12px;
                background-color: #FFFFFF;
                border-top: 1px solid #EFE4D8;
                gap: 8px;
            }

            #chat-input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #EFE4D8;
                border-radius: 50px;
                font-size: 0.84rem;
                font-family: 'Montserrat', sans-serif;
                color: #4A3B37;
                background-color: #FDF8F2;
                outline: none;
            }

            #chat-input:focus {
                border-color: #C87D70;
                background-color: #FFFFFF;
            }

            #chat-enviar {
                background-color: #3D231D;
                color: #FDF8F2;
                border: none;
                border-radius: 50px;
                padding: 0 16px;
                font-size: 0.95rem;
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            #chat-enviar:hover {
                background-color: #C87D70;
            }

            @media (max-width: 480px) {
                #chat-botao {
                    bottom: 16px;
                    right: 16px;
                    width: 54px;
                    height: 54px;
                }

                #chat-janela {
                    right: 16px;
                    bottom: 80px;
                    height: 440px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async function carregarBaseDados(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error("Falha ao carregar JSON: " + response.status);
            }
            return await response.json();
        } catch (erro) {
            console.warn("Chatbot usando base local de contingência:", erro.message);
            return BASE_DADOS_CONTINGENCIA;
        }
    }

    function encontrarResposta(perguntaUsuario, listaFaq) {
        const textoLimpo = normalizarTexto(perguntaUsuario);
        if (!textoLimpo) return null;

        let melhorItem = null;
        let maiorPontuacao = 0;

        for (const item of listaFaq) {
            let pontuacao = 0;
            const palavrasChave = Array.isArray(item.palavras_chave) ? item.palavras_chave : [];

            for (const kw of palavrasChave) {
                const kwLimpa = normalizarTexto(kw);
                if (!kwLimpa) continue;

                if (textoLimpo === kwLimpa) {
                    pontuacao += 10;
                } else if (new RegExp("\\b" + kwLimpa.replace(/\s+/g, "\\s+") + "\\b").test(textoLimpo)) {
                    pontuacao += 5;
                } else if (textoLimpo.includes(kwLimpa)) {
                    pontuacao += 2;
                }
            }

            const tituloLimpo = normalizarTexto(item.titulo);
            if (tituloLimpo && textoLimpo.includes(tituloLimpo)) {
                pontuacao += 6;
            }

            if (pontuacao > maiorPontuacao) {
                maiorPontuacao = pontuacao;
                melhorItem = item;
            }
        }

        return maiorPontuacao > 0 ? melhorItem : null;
    }

    window.initChatbot = async function (options = {}) {
        if (document.getElementById("chat-botao")) return;

        const jsonUrl = options.jsonUrl || "minha-base-dados.json";
        injetarEstilos();

        const dados = await carregarBaseDados(jsonUrl);
        const config = dados.configuracao || BASE_DADOS_CONTINGENCIA.configuracao;
        const faq = Array.isArray(dados.faq) ? dados.faq : BASE_DADOS_CONTINGENCIA.faq;

        // Botão flutuante
        const botao = document.createElement("button");
        botao.id = "chat-botao";
        botao.type = "button";
        botao.setAttribute("aria-label", "Abrir assistente virtual");
        botao.title = "Falar com o Assistente Virtual";
        botao.textContent = "💬";

        // Janela do chat
        const janela = document.createElement("div");
        janela.id = "chat-janela";
        janela.setAttribute("role", "dialog");
        janela.setAttribute("aria-label", config.empresa);

        janela.innerHTML = `
            <div id="chat-cabecalho">
                <div class="chat-titulo-grupo">
                    <span class="chat-titulo">Doce &amp; Sabor</span>
                    <span class="chat-subtitulo">● ${config.subtitulo || "Assistente virtual"}</span>
                </div>
                <div class="chat-acoes-topo">
                    <button type="button" class="chat-btn-topo" id="chat-limpar" title="Reiniciar conversa">↻</button>
                    <button type="button" class="chat-btn-topo" id="chat-fechar" aria-label="Fechar chat">✕</button>
                </div>
            </div>
            <div id="chat-mensagens"></div>
            <div id="chat-opcoes"></div>
            <form id="chat-form">
                <input type="text" id="chat-input" placeholder="Digite sua dúvida..." autocomplete="off" required>
                <button type="submit" id="chat-enviar" aria-label="Enviar mensagem">➤</button>
            </form>
        `;

        document.body.appendChild(botao);
        document.body.appendChild(janela);

        const mensagensEl = document.getElementById("chat-mensagens");
        const opcoesEl = document.getElementById("chat-opcoes");
        const formEl = document.getElementById("chat-form");
        const inputEl = document.getElementById("chat-input");
        const fecharBtn = document.getElementById("chat-fechar");
        const limparBtn = document.getElementById("chat-limpar");

        function adicionarMensagem(texto, autor, linkWhatsappTexto) {
            const balao = document.createElement("div");
            balao.className = "chat-msg " + (autor === "user" ? "chat-msg-user" : "chat-msg-bot");
            balao.textContent = texto;

            if (autor === "bot" && linkWhatsappTexto && config.whatsapp_numero) {
                const quebra = document.createElement("br");
                const link = document.createElement("a");
                link.className = "chat-btn-whats";
                link.href = `https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(linkWhatsappTexto)}`;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "💬 Continuar no WhatsApp";
                balao.appendChild(quebra);
                balao.appendChild(link);
            }

            mensagensEl.appendChild(balao);
            mensagensEl.scrollTop = mensagensEl.scrollHeight;
        }

        function processarPergunta(textoPergunta, itemDireto) {
            adicionarMensagem(textoPergunta, "user");

            const itemEncontrado = itemDireto || encontrarResposta(textoPergunta, faq);

            setTimeout(() => {
                if (itemEncontrado) {
                    adicionarMensagem(itemEncontrado.resposta, "bot", itemEncontrado.link_whatsapp);
                } else {
                    adicionarMensagem(
                        "Não encontrei uma resposta exata para essa dúvida por aqui, mas você pode escolher um dos tópicos abaixo ou falar diretamente com a nossa equipe no WhatsApp!",
                        "bot",
                        "Olá! Vim pelo site e gostaria de tirar uma dúvida."
                    );
                }
            }, 220);
        }

        function renderizarMenuRapido() {
            opcoesEl.innerHTML = "";
            const itensMenu = faq.filter((item) => item.exibir_no_menu);

            itensMenu.forEach((item) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "chat-opcao-btn";
                btn.textContent = item.titulo;
                btn.addEventListener("click", () => {
                    processarPergunta(item.titulo, item);
                });
                opcoesEl.appendChild(btn);
            });
        }

        function iniciarConversa() {
            mensagensEl.innerHTML = "";
            adicionarMensagem(
                config.mensagem_boas_vindas || "Olá! 👋 Como posso ajudar você hoje?",
                "bot"
            );
            renderizarMenuRapido();
        }

        botao.addEventListener("click", () => {
            const estaAberto = janela.classList.toggle("chat-aberto");
            if (estaAberto) {
                inputEl.focus();
            }
        });

        fecharBtn.addEventListener("click", () => {
            janela.classList.remove("chat-aberto");
        });

        limparBtn.addEventListener("click", () => {
            iniciarConversa();
        });

        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const texto = inputEl.value.trim();
            if (!texto) return;
            inputEl.value = "";
            processarPergunta(texto);
        });

        iniciarConversa();
    };
})();
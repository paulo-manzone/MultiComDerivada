$(document).ready(function(){
    $("#calcular").prop("disabled", true);
    $("#limpar").prop("disabled", true);

    //variáveis do problema
    var z, erro, n;

   //função para limpar as entradas 
    $("#limpar").click(function(){
        $("#n").val("");
        $("#z").val("");
        $("#tabelaVariaveis").val("");
        $("#erro").val("");
        $("#resultado").val("");
    });

    //função do botão criar tabela
    $("#btnCriarTabela").click(function(){
        $("#resultado").hide();
        $("#tabelaZ").empty();
        n = $("#variaveis").val();
        if(n<2 || n>5) {
            $("#tabelaZ").append("ERRO! <br> N<2  ou   N>5");
            return;
        }
        var tabela = createTable(n);
        $("#tabelaZ").append(tabela);
        $("#tabelaZ").append("<br><br> ε: <input id='erro' size=1></input>");
        $("#calcular").prop("disabled", false);
        $("#limpar").prop("disabled", false);
    });

    //função do botão calcular
    $("#calcular").click(function(){
        z = $("#z").val();
        erro = $("#erro").val();
        var inicial = [];
        for(i=1; i<=n; i++){
            inicial[i] = $("#xi"+i+"").val();
        }
        //configura div resultado
        $("#resultado").show();
        $("#resultado").empty();
        //chama método
        var resultado = metodoGradiente(z,erro,inicial);
        console.log(resultado);
        $("#resultado").val("x = " + resultado +" ;");
    });

    //==============================================
    //              Criar table
    //=============================================

    function createTable(n){
        var tabela, i;
        tabela = " Z: ";
        tabela += "<input type='text' size=50 id='z'></input><br>Ponto inicial: <br>";
        for(i=1; i<=n; i++){
            tabela += "x" + i + "<input type='text' size=1 id='xi" + i + "'> </input>"; 
        }
        return tabela;
    }


    //===========================================================================================
    //                                  Métodos
    //===========================================================================================
    
    //====================================
    //          Derivadas
    //===================================

    function f1x(z, pontox){
        var h, fdxmenosh, fdxmaish, T;
        h = 0.0000001;
        T = parseFloat(pontox)-h;
        fdxmenosh = eval(z);
        T = parseFloat(pontox)+h;
        fdxmaish = eval(z);
        return (fdxmaish- fdxmenosh)/(2*h);
    }

    function f2x(z, pontox){
        var h, fdxmenos2h, fdx, fdxmais2h, T;
        h = 0.0000001;
        T = parseFloat(pontox);
        fdx = eval(z);
        x = parseFloat(pontox)-2*h;
        fdxmenos2h = eval(z);
        T = parseFloat(pontox)+2*h;
        fdxmais2h = eval(z);
        return (fdxmais2h-(2*fdx) + fdxmenos2h)/(4*h*h);
    }
    //=====================================
    //          Cálculo do Gradiente
    //====================================
    function gradiente(z, n, x){
        var i, j, r, g=[], funcao;
        for(i=1; i<=n; i++){
            funcao = z;
            //mudando função pra ficar correta
            for(j=1; j<=n; j++){
                var regex = new RegExp("x"+j+"", "g");
                if(j!=i){
                    funcao = funcao.replace(regex, x[j]);
                }else{
                    funcao = funcao.replace(regex, "r");
                }
            }
            r=x[i]+0.00001;
            frmaish = eval(funcao);
            r=x[i]-0.00001;
            frmenosh = eval(funcao);
            doish = 0.00002;
            g[i] = (frmaish - frmenosh)/doish;
        }
        return g;
    } 

    //=====================================
    //          Método Gradiente
    //=====================================
    function metodoGradiente(z, erro, inicial){
        var res=[], x=[], xant=[], k, l, gradiente = [], xilambda=[], funcaomin, lambda;
        var regex;
        x=inicial;
        xant = x + 10; // garantir primeira iteração
        for(k=1; x-xant < erro; k++){
            xant = x;
            //calculando gradiente
            gradiente = gradiente(z, n, x);
            //calculando x + grad*lambda
            for(l=1; l<=n; l++){
                xilambda[l] = gradiente[l] + "*T +"x[l];
            }

            //formando uma equação pra ser minimizada
            funcaomin = z;
            for(l=1; l<=n; l++){
                regex = new RegExp("x"+l+"", "g");
                funcaomin.replace(regex, xilambda[l]);
            }
            //achando lambda que minimize a função
            lambda = newton(funcaomin, 0);
            //somando a X lambda * g
            for(l=1; l<=n; l++){
                x[l] = x + g[l] * lambda;
            }
        }
        return x;
    }

    //=====================================
    //          Newton Linear 
    //=====================================

    function newton(z, a){
        var xk, xkm1, fx, ffx;
        xk = a; //parte de a
        fx = f1x(z,xk); //derivada primeira
        ffx = f2x(z,xk); // derivada segunda
        xkm1 = xk - fx/ffx;
        while(Math.abs(xkm1-xk)>erro && Math.abs(fx) > erro){
            xk = xkm1;
            fx = f1x(z, xk);
            ffx = f2x(z, xk);
            xkm1 = xk - fx/ffx;
        }
        return xk;
    }


    


    //=============================================================================================
    //                          Desenvolvido por Paulo Maia e Rodney Souza
    //=============================================================================================



});
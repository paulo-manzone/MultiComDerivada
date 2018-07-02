$(document).ready(function(){
    $("#calcular").prop("disabled", true);
    $("#limpar").prop("disabled", true);
    $("#resultado").val("");
    $("#variaveis").val("2");
    

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
        $("#tabelaZ").append("<br><br> ε: <input id='erro' size=1 value='0.01'></input>");
        $("#calcular").prop("disabled", false);
        $("#limpar").prop("disabled", false);


    });

    //função do botão calcular
    $("#calcular").click(function(){
        z = $("#z").val();
        erro = $("#erro").val();
        erro*=0.1;
        var inicial = [];
        for(i=1; i<=n; i++){
            inicial[i] = $("#xi"+i+"").val();
        }
        //configura div resultado
        $("#resultado").show();
        $("#resultado").empty();
        $("#resultado").val("");
        //chama método
        var resultado = metodoGradiente(z,erro,inicial);
        var stringresultado= "X = (";
        for(i=1; i<=n; i++){
            stringresultado+= Math.round(resultado[i]/erro)*erro;
            if(i!=n) stringresultado +=  ", ";
        }
        stringresultado+= ")";
        $("#resultado").val(stringresultado + "\n\n\nCheque o Console (F12) para passo a passo do método");
    });

    //==============================================
    //              Criar table
    //=============================================

    function createTable(n){
        var tabela, i;
        tabela = " Z: ";
        //preenchendo automaticamente com um exemplo
        tabela += "<input type='text' size=50 id='z' value=' (x1+x2)**2-(x1+x2+2)'></input><br>Ponto inicial: <br>";
        for(i=1; i<=n; i++){
            tabela += "x" + i + "<input type='text'  value='3' size=1 id='xi" + i + "'></input>"; 
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
        h = 0.00000001;
        T = parseFloat(pontox)-h;
        fdxmenosh = eval(z);
        T = parseFloat(pontox)+h;
        fdxmaish = eval(z);
        return (fdxmaish- fdxmenosh)/(2*h);
    }

    function f2x(z, pontox){
        var h, fdxmenos2h, fdx, fdxmais2h, T;
        h = 0.00000001;
        T = parseFloat(pontox);
        fdx = eval(z);
        T = parseFloat(pontox)-2*h;
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
            r=x[i]*1+0.00001;
            frmaish = eval(funcao);
            r=x[i]*1-0.00001;
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
        var res=[], x=[], norma, k, l, grad=[], xilambda=[], funcaomin, lambda;
        var regex;
        x=inicial;
        console.log(" ==X inicial==");
        for(l=1; l<=n; l++){
            console.log("x["+l+"] = " + Math.round(x[l]/erro)*erro);
        }
        norma = 100; lambda = 100; // garantir primeira iteração
        for(k=1; norma>erro && Math.abs(lambda)>(erro*0.0001); k++){
            //parada por numero de iterações
            if(k>100) return ["undefined"];
            //calculando gradiente
            grad = gradiente(z, n, x);
            //calculando x + grad*lambda
            for(l=1; l<=n; l++){
                xilambda[l] = "("+ grad[l] + "*T+" + x[l]+ ")";
            }

            //formando uma equação pra ser minimizada
            funcaomin = z;
            for(l=1; l<=n; l++){
                regex = new RegExp("x"+l+"", "g");
                funcaomin=funcaomin.replace(regex, xilambda[l]);
            }
            //achando lambda que minimize a função
            lambda = newton(funcaomin, 0);
            //somando a X lambda * g
            for(l=1; l<=n; l++){
                x[l] = x[l]*1 + grad[l] * lambda;
            }
            //calculando norma do gradiente
            norma=0;
            for(l=1; l<=n; l++){
                if(Math.abs(grad[l])>norma) norma = Math.abs(grad[l]);
            }

            //printando estado no log
            console.log("=======ITERAÇÃO "+k+"========");
            for(l=1; l<=n; l++){
                console.log("x["+l+"] = " + Math.round(x[l]/erro)*erro);
            }
            console.log("Gradiente:");
            for(l=1; l<=n; l++){
                console.log("G["+l+"] = "+ grad[l]);
            }
            console.log("lambda = " + lambda);
            
        }
        console.log("++++++++++++++++++++++++++++++++");
        console.log("numero de iterações necessárias: "+ k);
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
        while(Math.abs(xkm1-xk)>0.00000000000000001*erro && Math.abs(fx) > erro){
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
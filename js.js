$(document).ready(function () {
        $("#QuoteBox").focus().autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "http://dev.markitondemand.com/api/Lookup/jsonp",
                    dataType: "jsonp",
                    data: {
                        input: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name + " (" + item.Symbol + ")",
                                value: item.Symbol
                            }
                        }));
                    }
                });
            },
            minLength: 1
        });
});
function LookupSymbol() {
    var _lookupInput = $("#QuoteBox").val();
    //Check the Quote box, and try to get a symbol from the Lookup API
    if (_lookupInput) {
        $.getJSON("http://dev.markitondemand.com/api/Lookup/jsonp?input=" + _lookupInput + "&callback=?",
            function (data) {
                if (data[0]) {
                    GetQuote(data[0].Symbol);
                }
                else {
                    $("#Output").html('<p>No equity found</p>');
                }
            }
        );
    }
}
function GetQuote(CleanSymbol) {
    if (CleanSymbol) {
        var $Output = $("#Output");

        $.getJSON("http://dev.markitondemand.com/Api/Quote/jsonp/?symbol=" + CleanSymbol + "&callback=?",
            function (data) {
                $Output.html('');
                var results = data.Data;
                if (results) {
                    var date = new Date(results.Timestamp);
                    var htmlBuilder = [];

                    //Add outputs to the htmlBuilder
                    htmlBuilder.push("<fieldset><legend>" + results.Name + "</legend>");
                    htmlBuilder.push("<dl>");
                    htmlBuilder.push(NewRow("Volume", results.Volume));
                    htmlBuilder.push(NewRow("Last Price", results.LastPrice));
                    htmlBuilder.push(NewRow("Market Cap", results.MarketCap));
                    htmlBuilder.push(NewRow("Change Percent YTD", results.ChangePercentYTD));
                    htmlBuilder.push(NewRow("As of:", date.toDateString()));
                    htmlBuilder.push("</dl></fieldset>");

                    //Append to page
                    $Output.append(htmlBuilder.join(''));
                }
                else {
                    $Output.html('<p>Quote Failed</p>');
                }
            }
        );
    }
}

function NewRow(name, value) {
    return '<dt>' + name + '</dt><dd>' + value + '</dd>';
}

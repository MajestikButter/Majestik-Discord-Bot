function parse(sending,msg){
    parsed = sending.toLowerCase().
    replace('${sender}',`<@${msg.author.id}>`);
    
    return parsed;
};
module.exports = {parse};
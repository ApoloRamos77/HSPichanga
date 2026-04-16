using FluentValidation;

namespace HSPichanga.Application.Features.Reservas.Commands.CrearReserva;

public class CrearReservaCommandValidator : AbstractValidator<CrearReservaCommand>
{
    public CrearReservaCommandValidator()
    {
        RuleFor(x => x.PartidoId)
            .NotEmpty().WithMessage("El ID del partido es obligatorio.");

        RuleFor(x => x.JugadorId)
            .NotEmpty().WithMessage("El ID del jugador es obligatorio.");

        // MetodoPago y NumeroOperacion son opcionales en el comando, así que no requerimos 'NotEmpty()' para ellos a menos que hagamos reglas condicionades
    }
}
